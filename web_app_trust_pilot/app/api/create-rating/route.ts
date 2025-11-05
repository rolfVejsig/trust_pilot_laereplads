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

  const { points, ratingText, rater, company} = await req.json();

  if (!points || !ratingText || !rater || !company) {
    console.error("Manglende påkrævede felter:", { points, ratingText, rater, company });
    return NextResponse.json(
      {
        message: "Manglende påkrævede felter",
        received: { points, ratingText, rater, company },
      },
      {status: 400});
  }

  try {
    const connection = await GetConnection();

    const query = `CALL InsertCompany(?, ?, ?, ?)`;
    const values = [points, ratingText, rater, company];

    const [result] = await connection.execute(query, values);

    await connection.end();

    return NextResponse.json(
      { message: "Rating oprettet" },
      {status:200});
  } catch (error) {
    console.error("Fejl ved oprettelse af rating:", error);
    return NextResponse.json(
      { message: "Intern serverfejl" },
      {status:500}
    );
  }
}