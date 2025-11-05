import { NextRequest, NextResponse } from "next/server";
import { GetConnection } from "../connection";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed"},
      {status:405}
    );
  }

  const body = await req.json();
  const username = String(body?.username || "").trim();
  const email = String(body?.email || "").trim();
  const password = String(body?.password || "");
  const profession = body?.profession;

  if (!username || !email || !password || !profession) {
    console.error("Manglende påkrævede felter:", { username, email, password, profession });
    return NextResponse.json(
      {
        message: "Manglende påkrævede felter",
        received: { username, email, profession: profession ?? null },
      },
      {status: 400});
  }
  if (username.length > 14) {
    return NextResponse.json({ message: "Brugernavn må højst være 14 tegn" }, { status: 400 });
  }
  if (email.length > 40) {
    return NextResponse.json({ message: "Email må højst være 40 tegn" }, { status: 400 });
  }
  const strongPw = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!strongPw.test(password)) {
    return NextResponse.json({ message: "Kodeord skal være mindst 8 tegn og indeholde 1 stort bogstav og 1 tal" }, { status: 400 });
  }

  try {
    const connection = await GetConnection();

    const [existsRows] = await connection.query(
      `SELECT 1 FROM Users WHERE UserEmail = ? OR UserName = ? LIMIT 1`,
      [email, username]
    );
    if (Array.isArray(existsRows) && (existsRows as any[]).length) {
      await connection.end();
      return NextResponse.json({ message: "Email eller brugernavn er allerede i brug" }, { status: 409 });
    }

    // Hash the password to hex SHA-256 to match schema CHAR(64)
    const hashed = crypto.createHash("sha256").update(String(password)).digest("hex");

    const professionId = Number(profession);
    if (!Number.isInteger(professionId) || professionId <= 0) {
      await connection.end();
      return NextResponse.json({ message: "Ugyldig profession" }, { status: 400 });
    }

    const query = `CALL InsertUser(?, ?, ?, ?)`;
    const values = [username, email, hashed, professionId];

  await connection.execute(query, values);

    await connection.end();

    return NextResponse.json(
      { message: "Bruger oprettet" },
      {status:200});
  } catch (error: any) {
    console.error("Fejl ved oprettelse af bruger:", error?.message || error);
    return NextResponse.json(
      { message: "Intern serverfejl" },
      {status:500}
    );
  }
}
