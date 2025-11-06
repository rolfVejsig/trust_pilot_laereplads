"use client";
import { useSearchParams } from "next/navigation";

export default function ErrorBanner() {
  const sp = useSearchParams();
  const err = sp ? sp.get("error") : null;
  if (!err) return null;
  return (
    <div
      className="text-red-700 bg-red-50 border border-red-200 rounded-md p-3 text-sm"
      role="alert"
      aria-live="polite"
      style={{ marginTop: 8 }}
    >
      {err}
    </div>
  );
}
