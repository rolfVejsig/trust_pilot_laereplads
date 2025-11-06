"use server";
import { redirect } from "next/navigation";
import { GetConnection } from "@/app/api/connection";
import { getSessionUser } from "@/authlib";

export async function submit(formData: FormData) {
  const rating = Number(formData.get("rating") || 0);
  const body = String(formData.get("body") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const companyId = Number(formData.get("companyId") || 0);

  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent(`/writeareview/new?company=${companyId || ''}`)}`);
  }
  if (!Number.isInteger(companyId) || companyId <= 0) {
    redirect(`/writeareview/new?company=${companyId || ''}&error=${encodeURIComponent("Ugyldig virksomhed")}`);
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    redirect(`/writeareview/new?company=${companyId}&error=${encodeURIComponent("Vælg en stjernevurdering (1-5)")}`);
  }
  if (!body || body.length < 5) {
    redirect(`/writeareview/new?company=${companyId}&error=${encodeURIComponent("Skriv venligst en kort anmeldelse (min. 5 tegn)")}`);
  }

  const conn = await GetConnection();
  try {
    // Resolve a valid raterId (handle sessions created without numeric id)
    let raterId = Number((user as any).id);
    if (!Number.isInteger(raterId) || raterId <= 0) {
      if (user?.email) {
        const [rows] = await conn.query(
          `SELECT UserId AS id FROM Users WHERE UserEmail = ? LIMIT 1`,
          [user.email]
        );
        const list = rows as any[];
        if (Array.isArray(list) && list.length) {
          raterId = Number(list[0].id);
        }
      }
    }
    if (!Number.isInteger(raterId) || raterId <= 0) {
      redirect(`/login?returnTo=${encodeURIComponent(`/writeareview/new?company=${companyId || ''}`)}`);
    }

    // Validate that raterId actually exists in DB to satisfy FK
    {
      const [okRows] = await conn.query(
        `SELECT 1 as ok FROM Users WHERE UserId = ? LIMIT 1`,
        [raterId]
      );
      const okList = okRows as any[];
      if (!Array.isArray(okList) || okList.length === 0) {
        redirect(`/login?returnTo=${encodeURIComponent(`/writeareview/new?company=${companyId || ''}`)}`);
      }
    }

    // Optional: ensure company exists too (avoid FK on Company)
    {
      const [cRows] = await conn.query(
        `SELECT 1 as ok FROM Companies WHERE CompanyId = ? LIMIT 1`,
        [companyId]
      );
      const cList = cRows as any[];
      if (!Array.isArray(cList) || cList.length === 0) {
        redirect(`/writeareview/new?company=${companyId || ''}&error=${encodeURIComponent('Virksomheden findes ikke')}`);
      }
    }
    // Discover rating columns to construct an INSERT that matches the schema
  const [cols] = await conn.query(`SHOW COLUMNS FROM Ratings`);
  const names = new Set((cols as any[]).map(c => String(c.Field)));
  const textCol = names.has('Text') ? 'Text' : (names.has('ReviewText') ? 'ReviewText' : 'RatingText');
  const hasTitle = names.has('Title') || names.has('ReviewTitle') || names.has('RatingTitle');
  const titleCol = names.has('Title') ? 'Title' : (names.has('ReviewTitle') ? 'ReviewTitle' : (names.has('RatingTitle') ? 'RatingTitle' : null));
  const dateCol = names.has('ReviewDate') ? 'ReviewDate' : (names.has('Date') ? 'Date' : (names.has('CreatedAt') ? 'CreatedAt' : (names.has('RatingDate') ? 'RatingDate' : null)));

  const colsList = [ 'Points', textCol, 'Rater', 'Company' ] as string[];
  const vals = [ rating, body, raterId, companyId ] as any[];
    if (titleCol) { colsList.splice(2, 0, titleCol); vals.splice(2, 0, (title || null)); }
    // Normalize date to YYYY-MM-DD if provided
    let normDate: string | null = null;
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        normDate = `${yyyy}-${mm}-${dd}`;
      } else {
        normDate = date; // let DB try if custom format
      }
    }
    if (dateCol) { colsList.splice(titleCol ? 3 : 2, 0, dateCol); vals.splice(titleCol ? 3 : 2, 0, (normDate || null)); }

    const placeholders = colsList.map(() => '?').join(',');
    const sql = `INSERT INTO Ratings (${colsList.join(', ')}) VALUES (${placeholders})`;
    await conn.execute(sql, vals);
  } finally {
    try { await conn.end(); } catch {}
  }

  redirect(`/review/${companyId}`);
}
