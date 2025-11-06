"use client";

import styles from "./register.module.css";
import MultiSelect from "@/app/components/MultiSelect";
import { registerBusiness } from "./submit";
import { useEffect, useState } from "react";

export default function BusinessRegisterPage() {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/professions", { cache: "no-store" });
        const data = await res.json();
        if (!mounted) return;
        setOptions(Array.isArray(data.professions) ? data.professions.map((p: any) => p.name as string) : []);
      } catch (e) {
        if (!mounted) return;
        setLoadError("Kunne ikke hente professioner");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const webpageURL = String(formData.get("website") || "").trim();
    const companyName = String(formData.get("companyName") || "").trim();
    const ownerFirstName = String(formData.get("firstName") || "").trim();
    const ownerLastName = String(formData.get("lastName") || "").trim();
    const workEmail = String(formData.get("workEmail") || "").trim();
    const companyPassword = String(formData.get("password") || "");
    const passwordrepeat = String(formData.get("passwordrepeat") || "");
    const phoneNumber = String(formData.get("phone") || "");
    const professions = formData.getAll("jobTitles").map(String);
    if (companyName.length > 20) { setError("Brugernavn må højst være 14 tegn"); return; }
    if (workEmail.length > 40) { setError("Email må højst være 40 tegn"); return; }
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(companyPassword)) { setError("Kodeord skal være mindst 8 tegn og indeholde 1 stort bogstav og 1 tal"); return; }

    // Basic client-side validation in Danish
    if (!webpageURL || !companyName || !ownerFirstName || !ownerLastName || !workEmail || !companyPassword || !passwordrepeat || !phoneNumber) {
      setError("Manglende påkrævede felter");
      return alert(error);
    }

    if (companyPassword !== passwordrepeat) {
      setError("Kodeordene matcher ikke");
      return alert(error);
    }

    const response = await fetch("/api/create-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {companyName,
        companyPassword,
        webpageURL,
        ownerFirstName,
        ownerLastName,
        workEmail,
        phoneNumber,
        professions}
      ),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || "Kunne ikke oprette konto");
      return;
    }

    window.location.href = "/login";
  };

  return (
    <section className={styles.page}>
      <div className={styles.heroShapes} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobCyan}`} />
        <span className={`${styles.blob} ${styles.blobGreen}`} />
        <span className={`${styles.blob} ${styles.blobPink}`} />
      </div>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <h1>Opret virksomhedskonto</h1>
          <p>Registrér din virksomhed og fortæl hvilke lærepladser I tilbyder.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.card}>
          <div className={styles.grid}>
            <div>
              <label className={styles.label} htmlFor="website">Virksomhedens hjemmeside</label>
              <input id="website" name="website" type="url" className={styles.input} placeholder="https://dit-domæne.dk" />
            </div>
            <div>
              <label className={styles.label} htmlFor="companyName">Firmanavn</label>
              <input id="companyName" name="companyName" className={styles.input} placeholder="Fx Nordjyde Byg ApS" />
            </div>
            <div>
              <label className={styles.label} htmlFor="firstName">Fornavn</label>
              <input id="firstName" name="firstName" className={styles.input} />
            </div>
            <div>
              <label className={styles.label} htmlFor="lastName">Efternavn</label>
              <input id="lastName" name="lastName" className={styles.input} />
            </div>
            <div>
              <label className={styles.label} htmlFor="roleTitle">Jobtitel</label>
              <input id="roleTitle" name="roleTitle" className={styles.input} placeholder="Fx HR-ansvarlig" />
            </div>
            <div>
              <label className={styles.label} htmlFor="workEmail">Arbejds-e-mail</label>
              <input id="workEmail" name="workEmail" type="email" className={styles.input} placeholder="navn@firma.dk" />
            </div>
            <div>
              <label className={styles.label} htmlFor="password">Kodeord</label>
              <input id="password" name="password" type="password" className={styles.input} />
            </div>
            <div>
              <label className={styles.label} htmlFor="password">Gentag Kodeord</label>
              <input id="passwordrepeat" name="passwordrepeat" type="password" className={styles.input} />
            </div>
            <div>
              <label className={styles.label} htmlFor="phone">Telefonnummer</label>
              <input id="phone" name="phone" className={styles.input} placeholder="+45 12 34 56 78" />
            </div>
            
            <div>
              <label className={styles.label}>Lærepladser I tilbyder</label>
              <MultiSelect
                name="jobTitles"
                options={options}
                placeholder={loading ? "Henter…" : "Søg fx tømrer, IT-support…"}
              />
              <p className={styles.help}>Vælg én eller flere. Du kan søge og kombinere (fx Tømrer og IT-supporter).</p>
              {loadError && <p className="text-sm text-red-500">{loadError}</p>}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primary}>Opret virksomhed</button>
          </div>
        </form>
      </div>
    </section>
  );
}
