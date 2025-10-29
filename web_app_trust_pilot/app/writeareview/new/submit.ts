"use server";
import { redirect } from "next/navigation";

export async function submit(formData: FormData) {
  const payload = {
    rating: Number(formData.get("rating") || 0),
    title: String(formData.get("title") || ""),
    body: String(formData.get("body") || ""),
    date: String(formData.get("date") || ""),
  };
  console.log("Review submitted:", payload);
  // Here you could persist to a DB.
  redirect("/");
}
