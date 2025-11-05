"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./newaccount.module.css";

type Profession = { id: number; name: string };

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [professionId, setProfessionId] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/professions")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setProfessions(Array.isArray(data.professions) ? data.professions : []);
      })
      .catch(() => {
        setError("Kunne ikke hente professioner");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Basic client-side validation in Danish
    if (!formData.get("username") || !formData.get("email") || !formData.get("password") || !formData.get("passwordrepeat") || !professionId) {
      setError("Manglende påkrævede felter");
      return;
    }

    if (formData.get("password") !== formData.get("passwordrepeat")) {
      setError("Kodeordene matcher ikke");
      return;
    }

    const username = String(formData.get("username") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    if (username.length > 14) { setError("Brugernavn må højst være 14 tegn"); return; }
    if (email.length > 40) { setError("Email må højst være 40 tegn"); return; }
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) { setError("Kodeord skal være mindst 8 tegn og indeholde 1 stort bogstav og 1 tal"); return; }

    const response = await fetch("/api/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        profession: Number(professionId),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || "Kunne ikke oprette konto");
      return;
    }

    window.location.href = "/login";
  };

  return (
    <section className={`${styles.newRoot} ${styles.newSection} flex min-h-screen items-center justify-center p-6`}>
      <div className={styles.heroShapes} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobCyan}`} />
        <span className={`${styles.blob} ${styles.blobGreen}`} />
        <span className={`${styles.blob} ${styles.blobPink}`} />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
        <div className="text-center space-y-1 mb-2">
          <h1 className="text-2xl font-semibold text-slate-900">Opret konto</h1>
          <p className="text-sm text-slate-600">Det tager ikke mange minutter</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Brugernavn"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Kodeord"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="password"
            name="passwordrepeat"
            placeholder="Gentag kodeord"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <div>
            <select
              id="profession"
              name="profession"
              value={professionId}
              onChange={(e) => setProfessionId(e.target.value)}
              className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none ${
                professionId ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <option value="" disabled>
                Vælg en profession
              </option>
              {professions.map((p) => (
                <option key={p.id} value={p.id} className="text-gray-900">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-sky-500 py-2 font-medium text-white transition hover:bg-sky-600 disabled:opacity-50"
        >Opret account</button>

        <p className="text-sm text-center text-gray-600">
          Har du allerede en konto?{" "}
          <Link href="/login" className="text-sky-600 hover:underline">Log ind her</Link>
        </p>
      </form>
    </section>
  );
}