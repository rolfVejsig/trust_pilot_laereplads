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

  // Store structured review in RatingText as JSON to include title/date without DB migration
  const ratingText = JSON.stringify({ title, date, body });

  const conn = await GetConnection();
  try {
    await conn.execute(
      `INSERT INTO Ratings (Points, RatingText, Rater, Company) VALUES (?,?,?,?)`,
      [rating, ratingText, user.id, companyId]
    );
  } finally {
    try { await conn.end(); } catch {}
  }

  redirect(`/review/${companyId}`);
}
