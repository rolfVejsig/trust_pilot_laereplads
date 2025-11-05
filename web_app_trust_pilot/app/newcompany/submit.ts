"use server";

import { redirect } from "next/navigation";
import crypto from "crypto";
import { GetConnection } from "../api/connection";

export async function registerBusiness(formData: FormData) {
  const payload = {
    website: (formData.get("website") || "").toString().trim(),
    companyName: (formData.get("companyName") || "").toString().trim(),
    firstName: (formData.get("firstName") || "").toString().trim(),
    lastName: (formData.get("lastName") || "").toString().trim(),
    roleTitle: (formData.get("roleTitle") || "").toString().trim(),
    workEmail: (formData.get("workEmail") || "").toString().trim(),
    password: (formData.get("password") || "").toString(),
    phone: (formData.get("phone") || "").toString().trim(),
    jobTitles: formData.getAll("jobTitles").map(String),
  };

  if (!payload.companyName || !payload.workEmail || !payload.password) {
    redirect("/newcompany?error=Manglende%20felter");
  }
  if (payload.companyName.length > 20) {
    redirect("/newcompany?error=Firmanavn%20for%20langt%20(max%2020)");
  }
  if (payload.workEmail.length > 40) {
    redirect("/newcompany?error=Email%20for%20lang%20(max%2040)");
  }
  if (payload.firstName && payload.firstName.length > 14) {
    redirect("/newcompany?error=Fornavn%20for%20langt%20(max%2014)");
  }
  if (payload.lastName && payload.lastName.length > 18) {
    redirect("/newcompany?error=Efternavn%20for%20langt%20(max%2018)");
  }
  if (payload.website && payload.website.length > 255) {
    redirect("/newcompany?error=URL%20for%20lang%20(max%20255)");
  }
  // Password rule (same as users): min 8, at least 1 uppercase and 1 digit
  const strongPw = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!strongPw.test(payload.password)) {
    redirect("/newcompany?error=Kodeord%20skal%20have%208%2B%20tegn%2C%201%20stort%20bogstav%20og%201%20tal");
  }

  const hashed = crypto.createHash("sha256").update(payload.password).digest("hex");
  const phoneDigitsRaw = payload.phone.replace(/\D/g, "");
  const phoneDigits = phoneDigitsRaw ? phoneDigitsRaw.slice(-8) : "";
  if (payload.phone && phoneDigits.length !== 8) {
    redirect("/newcompany?error=Telefon%20skal%20v%C3%A6re%208%20cifre");
  }

  const conn = await GetConnection();
  try {
    await conn.beginTransaction();
    const [res]: any = await conn.execute(
      `INSERT INTO Companies (CompanyName, CompanyPassword, WebpageURL, OwnerFirstName, OwnerLastName, WorkEmail, PhoneNumber)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.companyName,
        hashed,
        payload.website || null,
        payload.firstName || null,
        payload.lastName || null,
        payload.workEmail,
        phoneDigits || null,
      ]
    );
    const companyId = Number(res?.insertId || 0);

    let professionIds: number[] = [];
    if (payload.jobTitles.length) {
      const placeholders = payload.jobTitles.map(() => "?").join(",");
      const [rows] = await conn.query(
        `SELECT ProfessionId as id FROM Professions WHERE ProfessionName IN (${placeholders})`,
        payload.jobTitles
      );
      professionIds = (rows as any[]).map((r) => Number(r.id)).filter((n) => Number.isFinite(n));
    }

    if (companyId && professionIds.length) {
      const valuesPlaceholders = professionIds.map(() => "(?, ?)").join(",");
      const values: any[] = [];
      for (const pid of professionIds) {
        values.push(companyId, pid);
      }
      await conn.execute(
        `INSERT INTO CompanyProfessions (Company, Profession) VALUES ${valuesPlaceholders}`,
        values
      );
    }

    await conn.commit();
  } catch (error) {
    console.error("Fejl ved oprettelse af virksomhed:", error);
    try { await conn.rollback(); } catch {}
    redirect("/newcompany?error=server");
  } finally {
    await conn.end();
  }


  redirect("/login");
}
