import { NextRequest, NextResponse } from "next/server";
import { GetConnection } from "../connection"
import crypto from "crypto";

export async function DELETE(req: NextRequest) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed"},
      {status:405}
    );
  }

  const { ratingId } = await req.json();

  if (!ratingId) {
    console.error("Manglende påkrævede felter:", { ratingId });
    return NextResponse.json(
      {
        message: "Manglende påkrævede felter",
        received: { ratingId },
      },
      {status: 400});
  }

  try {
    const connection = await GetConnection();

    const query = `CALL DeleteRating(?, ?, ?, ?)`;
    const values = [ratingId];

    const [result] = await connection.execute(query, values);

    await connection.end();

    return NextResponse.json(
      { message: "Rating blev slættet" },
      {status:200});
  } catch (error) {
    console.error("Rating kunne ikke slættes:", error);
    return NextResponse.json(
      { message: "Intern serverfejl" },
      {status:500}
    );
  }
}