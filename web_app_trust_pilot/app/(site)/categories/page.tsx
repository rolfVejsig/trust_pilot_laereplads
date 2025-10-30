"use client";

import styles from "./categories.module.css";
import Link from "next/link";
import { useMemo, useState } from "react";

type Category = {
  title: string;
  icon: string; 
  tone: "yellow" | "pink" | "orange" | "green" | "blue" | "teal";
  items: string[];
};

const categories: Category[] = [
  {
    title: "Teknologi, byggeri og transport",
    icon: "engineering",
    tone: "yellow",
    items: [
      "Tømrer",
      "Murer",
      "Elektriker",
      "Smed",
      "Industritekniker",
      "VVS-energispecialist",
      "Bygningsmaler",
      "Mekaniker",
      "Chauffør",
      "IT-supporter",
    ],
  },
  {
    title: "Omsorg, sundhed og pædagogik",
    icon: "health_and_safety",
    tone: "green",
    items: [
      "Social- og sundhedsassistent",
      "Social- og sundhedshjælper",
      "Pædagogisk assistent",
      "Tandklinikassistent",
      "Hospitalsservice",
      "Optiker",
    ],
  },
  {
    title: "Kontor, handel og forretningsservice",
    icon: "business_center",
    tone: "blue",
    items: [
      "Kontor",
      "Detailhandel",
      "Handelsassistent",
      "Finans",
      "Eventkoordinator",
      "Turisme og service",
    ],
  },
  {
    title: "Fødevare, jordbrug og oplevelser",
    icon: "restaurant",
    tone: "orange",
    items: [
      "Bager",
      "Kok",
      "Tjener",
      "Gartner",
      "Landmand",
      "Dyrepasser",
      "Fiskeri",
      "Mad til mennesker (catering)",
    ],
  },
];

export default function CategoriesPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categories;
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter((it) => it.toLowerCase().includes(term)),
      }))
      .filter((c) => c.title.toLowerCase().includes(term) || c.items.length > 0);
  }, [q]);

  return (
    <div className={styles.pageWrap}>
      <section className={styles.searchHero}>
        <h1>Hvad søger du?</h1>
        <div className={styles.searchBar} role="search">
          <i className="material-icons" aria-hidden>
            search
          </i>
          <input
            type="text"
            placeholder="Søg"
            aria-label="Søg i kategorier og uddannelser"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </section>

      <section className={styles.gridSection} aria-labelledby="cats-head">
        <div className={styles.sectionHead}>
          <h2 id="cats-head">Udforsk erhvervsuddannelser efter hovedområde</h2>
        </div>

        <div className={styles.grid}>
          {filtered.map((cat) => (
            <article key={cat.title} className={`${styles.card} ${styles[cat.tone]}`}>
              <header className={styles.cardHead}>
                <span className={styles.iconCircle} aria-hidden>
                  <i className="material-icons">{cat.icon}</i>
                </span>
                <h3>{cat.title}</h3>
              </header>
              <ul className={styles.list}>
                {cat.items.map((item) => (
                  <li key={item}>
                    <Link href="#" aria-label={item}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
