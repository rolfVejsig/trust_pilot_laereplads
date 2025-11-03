import { NextRequest, NextResponse } from "next/server";
import { GetConnection } from "../connection"

export async function GET(_req: NextRequest) {
  try {
    const connection = await GetConnection();
    let rows: any[] = [];
    try {
      const [res] = await connection.query(
        "SELECT ProfessionId as id, ProfessionName as name FROM GetProfessions"
      );
      rows = res as any[];
    } catch {
      const [res] = await connection.query(
        "SELECT ProfessionId as id, ProfessionName as name FROM Professions"
      );
      rows = res as any[];
    }

    await connection.end();
    return NextResponse.json({ professions: rows }, { status: 200 });
  } catch (error) {
    console.error("Fejl ved hentning af professioner:", error);
    return NextResponse.json(
      { message: "Kunne ikke hente professioner" },
      { status: 500 }
    );
  }
}