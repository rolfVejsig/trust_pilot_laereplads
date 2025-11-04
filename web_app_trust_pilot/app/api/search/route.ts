import { NextRequest, NextResponse } from "next/server";
import { GetConnection } from "../connection";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ companies: [] }, { status: 200 });
  }

  try {
    const conn = await GetConnection();
    const like = `%${q}%`;
    const [rows] = await conn.query(
      `SELECT CompanyId AS id, CompanyName AS name, WebpageURL AS url
       FROM Companies
       WHERE CompanyName LIKE ? OR WebpageURL LIKE ?
       ORDER BY CompanyName ASC
       LIMIT 8`,
      [like, like]
    );
    await conn.end();
    return NextResponse.json({ companies: rows }, { status: 200 });
  } catch (error) {
    console.error("Fejl ved søgning:", error);
    return NextResponse.json({ companies: [] }, { status: 200 });
  }
}
