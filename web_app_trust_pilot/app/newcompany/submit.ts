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

  // Basic validation (Danish messages kept to logs or can be surfaced via redirect params if needed)
  if (!payload.companyName || !payload.workEmail || !payload.password) {
    console.error("Manglende påkrævede felter (virksomhed)", payload);
    redirect("/newcompany?error=missing");
  }

  const hashed = crypto.createHash("sha256").update(payload.password).digest("hex");
  const phoneDigits = payload.phone.replace(/\D/g, "").slice(-8);

  const conn = await GetConnection();
  try {
    await conn.beginTransaction();

    // Insert company using stored procedure
    const insertCompanyQuery = "CALL InsertCompany(?, ?, ?, ?, ?, ?, ?)";
    const insertCompanyValues = [
      payload.companyName,
      hashed,
      payload.website || null,
      payload.firstName || null,
      payload.lastName || null,
      payload.workEmail,
      phoneDigits || null,
    ];
    await conn.execute(insertCompanyQuery, insertCompanyValues);

    // Get the new company id from this session
    const [idRows] = await conn.query("SELECT LAST_INSERT_ID() as id");
    const companyId = Array.isArray(idRows) && idRows.length ? (idRows as any)[0].id as number : 0;

    // Map job title names -> profession ids
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
