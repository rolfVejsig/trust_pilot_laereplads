import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { GetConnection } from "./app/api/connection";

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
    return await new SignJWT(payload).setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('2 hour from now')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
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

    const conn = await GetConnection();
    try {
        const [rows] = await conn.query(
            `SELECT UserId as id, UserName as name, UserEmail as email, UserPassword as hash
             FROM Users
             WHERE UserEmail = ? OR UserName = ?
             LIMIT 1`,
            [identifier, identifier]
        );
        const list = rows as any[];
        if (!Array.isArray(list) || list.length === 0) throw new Error('Forkert brugernavn eller kodeord');
        const u = list[0];
        if (String(u.hash) !== hashed) throw new Error('Forkert brugernavn eller kodeord');

        const user: SessionUser = { id: Number(u.id), name: String(u.name || ''), email: String(u.email || '') };
        const expires = new Date(Date.now() + 60 * 120 * 1000);
        const session = await encrypt({ user, expires });
        (await cookies()).set('session', session, { expires, httpOnly: true });
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