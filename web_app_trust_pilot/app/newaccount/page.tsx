"use client";

import { useState } from "react";
import Link from "next/link";

import styles from "./newaccount.module.css";

const JOB_TITLES = [
  "Tømrer",
  "Murer",
  "Elektriker",
  "Smed",
  "VVS-energispecialist",
  "Bygningsmaler",
  "Mekaniker",
  "Chauffør",
  "IT-supporter",
  "Webudvikler",
  "Kontor",
  "Detailhandel",
  "Kok",
  "Tjener",
  "Bager",
  "Gartner",
  "Landmand",
];

export default function Register() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || "Failed to create account");
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
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none"
              onChange={(e) => {
                const select = e.target;
                select.classList.toggle('text-gray-900', select.value !== '');
                select.classList.toggle('text-gray-400', select.value === '');
              }}
            >
              <option value="" disabled hidden>Vælg en profession</option>
              {JOB_TITLES.map((title) => (
                <option key={title} value={title} className="text-gray-900">{title}</option>
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