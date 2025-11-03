"use server";

import { redirect } from "next/navigation";

export async function registerBusiness(formData: FormData) {
  const payload = {
    website: (formData.get("website") || "").toString().trim(),
    companyName: (formData.get("companyName") || "").toString().trim(),
    firstName: (formData.get("firstName") || "").toString().trim(),
    lastName: (formData.get("lastName") || "").toString().trim(),
    roleTitle: (formData.get("roleTitle") || "").toString().trim(),
    workEmail: (formData.get("workEmail") || "").toString().trim(),
    phone: (formData.get("phone") || "").toString().trim(),
    jobTitles: formData.getAll("jobTitles").map(String),
  };

  console.log("Business registration:", payload);


  redirect("/login");
}
