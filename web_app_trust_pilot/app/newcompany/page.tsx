"use client";

import styles from "./register.module.css";
import MultiSelect from "@/app/components/MultiSelect";
import { registerBusiness } from "./submit";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function BusinessRegisterPage() {
  const searchParams = useSearchParams();
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const error = searchParams?.get("error") || null;

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

        {error && (
          <div className={styles.card} style={{ color: "#b91c1c", marginBottom: 12 }} role="alert">
            {decodeURIComponent(error)}
          </div>
        )}
        <form action={registerBusiness} className={styles.card}>
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
