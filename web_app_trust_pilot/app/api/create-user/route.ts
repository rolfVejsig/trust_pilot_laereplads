import { NextRequest, NextResponse } from "next/server";
import { GetConnection } from "../connection"
import crypto from "crypto";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed"},
      {status:405}
    );
  }

  const { username, email, password, profession } = await req.json();

  if (!username || !email || !password || !profession) {
    console.error("Manglende påkrævede felter:", { username, email, password, profession });
    return NextResponse.json(
      {
        message: "Manglende påkrævede felter",
        received: { username, email, profession: profession ?? null },
      },
      {status: 400});
  }

  console.log("Request body is valid:", { username, email, profession });

  try {
    const connection = await GetConnection();

    // Hash the password to hex SHA-256 to match schema CHAR(64)
    const hashed = crypto.createHash("sha256").update(String(password)).digest("hex");

    const professionId = Number(profession);
    if (!Number.isInteger(professionId) || professionId <= 0) {
      await connection.end();
      return NextResponse.json({ message: "Ugyldig profession" }, { status: 400 });
    }

    const query = `CALL InsertUser(?, ?, ?, ?)`;
    const values = [username, email, hashed, professionId];

    const [result] = await connection.execute(query, values);

    await connection.end();

    return NextResponse.json(
      { message: "Bruger oprettet" },
      {status:200});
  } catch (error) {
    console.error("Fejl ved oprettelse af bruger:", error);
    return NextResponse.json(
      { message: "Intern serverfejl" },
      {status:500}
    );
  }
}
