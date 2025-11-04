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

  const { companyName, companyPassword, webpageURL, ownerFirstName, ownerLastName,
    workEmail, phoneNumber, professions } = await req.json();

  if (!companyName || !companyPassword || !webpageURL || !ownerFirstName || !ownerLastName
    || !workEmail || !phoneNumber || !professions) {
    console.error("Manglende påkrævede felter:", { companyName, companyPassword, webpageURL, ownerFirstName, ownerLastName,
    workEmail, phoneNumber, professions });
    return NextResponse.json(
      {
        message: "Manglende påkrævede felter",
        received: { companyName, companyPassword, webpageURL, ownerFirstName, ownerLastName,
        workEmail, phoneNumber, professions: professions ?? null },
      },
      {status: 400});
  }

  try {
    const connection = await GetConnection();

    // Hash the password to hex SHA-256 to match schema CHAR(64)
    const hashed = crypto.createHash("sha256").update(String(companyPassword)).digest("hex");

    const professionId = Number(professions);
    if (!Number.isInteger(professionId) || professionId <= 0) {
      await connection.end();
      return NextResponse.json({ message: "Ugyldig profession" }, { status: 400 });
    }

    const query = `CALL InsertCompany(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [companyName,  hashed, webpageURL, ownerFirstName, ownerLastName,
        workEmail, phoneNumber, professionId, professions];

    const [result] = await connection.execute(query, values);

    await connection.end();

    return NextResponse.json(
      { message: "Virksomheds account oprettet" },
      {status:200});
  } catch (error) {
    console.error("Fejl ved oprettelse af account:", error);
    return NextResponse.json(
      { message: "Intern serverfejl" },
      {status:500}
    );
  }
}