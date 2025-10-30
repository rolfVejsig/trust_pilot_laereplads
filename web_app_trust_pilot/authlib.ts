import { error } from "console";
import { SignJWT, jwtVerify} from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey)
const isProd = process.env.NODE_ENV === 'production'

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
        secure: isProd,
        sameSite: 'lax',
        path: '/',
    });
    return res;
}

export async function login(formData: FormData) {
    const user = {name: formData.get('username'), password: formData.get('password')}

    const expires = new Date(Date.now() + 60*120*1000);
    const session = await encrypt({ user, expires});

    (await cookies()).set('session', session, {
        expires,
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
    })

    return true;
}

export async function createaccount(formData: FormData): Promise<any>{

    if (formData.get('password') != formData.get('passwordrepeat'))  throw new Error("Password doesn't match.");
    
     const user = {name: formData.get('username'), password: formData.get('password'), email: formData.get('email')}

     const expires = new Date(Date.now() + 60*120*1000);
    const session = await encrypt({ user, expires});

    (await cookies()).set('session', session, {
        expires,
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
    })

    return true;
}