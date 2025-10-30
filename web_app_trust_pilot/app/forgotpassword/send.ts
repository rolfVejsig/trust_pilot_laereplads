"use server";
import { redirect } from "next/navigation";

export async function sendReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  console.log("Password reset requested for:", email);
  redirect("/login");
}
