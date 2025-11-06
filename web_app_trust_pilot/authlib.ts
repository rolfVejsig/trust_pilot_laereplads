import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { GetConnection } from "./app/api/connection";

function getSigningKey(): Uint8Array {
    // Prefer explicit env secrets; fall back to a stable dev secret to avoid zero-length key
    const candidates = [process.env.SECRET, process.env.JWT_SECRET, process.env.NEXTAUTH_SECRET];
    let secret = candidates.find((v) => v && String(v).trim().length > 0)?.trim();
    if (!secret) {
        // Construct a non-empty dev-only secret; consider overriding via env in production
        const seed = `${process.env.DB_HOST || ''}:${process.env.DB_NAME || ''}:${process.env.NODE_ENV || 'development'}`;
        secret = seed || 'dev-secret';
    }
    // Derive a 32-byte key for HS256 even if the secret string is short
    return crypto.createHash('sha256').update(secret).digest();
}

export async function encrypt(payload: any) {
    const key = getSigningKey();
    return await new SignJWT(payload).setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('2 hour from now')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const key = getSigningKey();
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 60 * 120 *1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}

export type SessionUser = { id: number; name: string; email: string };

function validatePasswordStrength(pw: string) {
    // Min 8 chars, at least 1 uppercase and 1 number
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

export async function login(formData: FormData) {
    const identifier = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');

    if (!identifier || !password) throw new Error('Udfyld brugernavn/email og kodeord');

    const hashed = crypto.createHash('sha256').update(password).digest('hex');
    const md5 = crypto.createHash('md5').update(password).digest('hex'); // legacy fallback if needed

    const conn = await GetConnection();
    try {
        // Be robust to case differences in stored data by comparing in LOWER()
        const [rows] = await conn.query(
            `SELECT UserId as id, UserName as name, UserEmail as email, UserPassword as hash
             FROM Users
             WHERE LOWER(TRIM(UserEmail)) = LOWER(TRIM(?))
                OR LOWER(TRIM(UserName)) = LOWER(TRIM(?))
             LIMIT 1`,
            [identifier, identifier]
        );
        const list = rows as any[];
        if (!Array.isArray(list) || list.length === 0) throw new Error('Forkert brugernavn eller kodeord');
        const u = list[0];
        // Compare hashes case-insensitively to tolerate different HEX casing
        const dbHash = String(u.hash || '').trim();
        let ok = dbHash.toLowerCase() === hashed;

        // Legacy fallbacks: allow plain-text or MD5 stored passwords (dev data), then migrate to SHA-256
        if (!ok && dbHash && dbHash.length && dbHash.indexOf(':') === -1) {
            if (dbHash === password) {
                ok = true;
            } else if (dbHash.length === 32 && dbHash.toLowerCase() === md5) {
                ok = true;
            }
            if (ok) {
                // Migrate to SHA-256 immediately
                try {
                    await conn.execute(`UPDATE Users SET UserPassword = ? WHERE UserId = ?`, [hashed, Number(u.id)]);
                } catch {}
            }
        }
        if (!ok) throw new Error('Forkert brugernavn eller kodeord');

        const user: SessionUser = { id: Number(u.id), name: String(u.name || ''), email: String(u.email || '') };
        const expires = new Date(Date.now() + 60 * 120 * 1000);
    const session = await encrypt({ user, expires });
    (await cookies()).set('session', session, { expires, httpOnly: true, path: '/', sameSite: 'lax' as any });
        return true;
    } finally {
        try { await conn.end(); } catch {}
    }
}

export async function createaccount(formData: FormData): Promise<any>{

    if (formData.get('password') != formData.get('passwordrepeat'))  throw new Error("Password dosin't match.");
    
     const user = {name: formData.get('username'), password: formData.get('password'), email: formData.get('email')}

     const expires = new Date(Date.now() + 60*120*1000);
    const session = await encrypt({ user, expires});

    (await cookies()).set('session', session, { expires, httpOnly: true})

    return true;
}

export async function getSessionUser(): Promise<SessionUser | null> {
    const jar = await cookies();
    const session = jar.get('session')?.value;
    if (!session) return null;
    try {
        const payload = await decrypt(session);
        return payload.user as SessionUser;
    } catch {
        return null;
    }
}

export async function logout() {
    const jar = await cookies();
    jar.set('session', '', { expires: new Date(0), httpOnly: true });
    return true;
}