import { NextRequest, NextResponse } from "next/server";
import { GetConnection } from "../connection"

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed"},
      {status:405}
    );
  }

  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    console.error("Manglende påkrævede felter:", { username, email, password });
    return NextResponse.json(
      {
        message: "Manglende påkrævede felter",
        received: { username, email, password },
      },
      {status: 400});
  }

  console.log("Request body is valid:", { username, email, password });

  try {
    const connection = await GetConnection();

    const query = `CALL InsertUser(?, ?, ?, ?)`;
    const values = [username, email, password, 1];

    const [result] = await connection.execute(query, values);

    await connection.end();

    return NextResponse.json(
      { message: "User created successfully" },
      {status:200});
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      {status:500}
    );
  }
}