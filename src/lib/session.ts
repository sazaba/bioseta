import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Llave secreta
const secretKey = "secret-key-bioseta-ultra-premium";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expires });

  // CORRECCIÓN: Agregamos 'await' antes de cookies()
  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  // CORRECCIÓN: Agregamos 'await' antes de cookies()
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) return null;
  return await decrypt(session);
}

export async function logout() {
  // CORRECCIÓN: Agregamos 'await' antes de cookies()
  (await cookies()).set("session", "", { expires: new Date(0) });
}