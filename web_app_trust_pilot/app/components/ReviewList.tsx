"use client";
import { useMemo, useState } from "react";

type Review = { id: number; points: number; text: string; title?: string; date?: string; userName: string };

const STAR_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e"]; // 1..5
function colorFor(points: number) {
  const p = Math.max(1, Math.min(5, Math.round(points)));
  return STAR_COLORS[p - 1];
}

function StarBoxes({ points }: { points: number }) {
  const p = Math.max(0, Math.min(5, Math.round(points)));
  const col = colorFor(points);
  return (
    <div className="stars-box" aria-label={`${p} ud af 5 stjerner`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= p;
        return (
          <span
            key={idx}
            className={`star-box${filled ? " filled" : ""}`}
            style={{ color: filled ? col : "#cbd5e1", borderColor: filled ? col : "#e5e7eb" }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function fmtDate(d?: string) {
  if (!d) return null;
  const t = new Date(d);
  if (isNaN(t.getTime())) return d;
  return t.toLocaleDateString('da-DK', { day: '2-digit', month: 'long', year: 'numeric' });
}

type Props = {
  reviews: Review[];
  avg: number;
  count: number;
  distribution: Record<1|2|3|4|5, number>;
};

export default function ReviewList({ reviews, avg, count, distribution }: Props) {
  const [q, setQ] = useState("");
  const [selectedStars, setSelectedStars] = useState<number[]>([]); // e.g., [5,4]
  const [sort, setSort] = useState<string>("Seneste");

  function toggleStar(n: number) {
    setSelectedStars((prev) => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
  }

  const filtered = useMemo(() => {
    let list = reviews;
    if (selectedStars.length) list = list.filter(r => selectedStars.includes(Math.round(r.points)));
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter(r => (r.title || "").toLowerCase().includes(needle) || r.text.toLowerCase().includes(needle));
    }
    // sort: currently only Seneste (by id desc)
    list = [...list].sort((a,b) => b.id - a.id);
    return list;
  }, [reviews, q, selectedStars, sort]);

  const pct = (n: number) => (count ? Math.round((n / count) * 100) : 0);

  return (
    <div className="all-reviews">
      <aside className="filters" aria-label="Filtre og oversigt">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span className="score-num" style={{ fontSize: 22 }}>{avg.toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
          <span style={{ color: '#64748b', fontSize: 12 }}>{count} {count === 1 ? 'anmeldelse' : 'anmeldelser'}</span>
        </div>
        <div className="bars" style={{ marginTop: 10 }}>
          {[5,4,3,2,1].map((n) => (
            <label key={n} className="bar">
              <div style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                <input type="checkbox" aria-label={`${n} stjerner`} checked={selectedStars.includes(n)} onChange={() => toggleStar(n)} />
                <span>{n} stjerner</span>
              </div>
              <div className="meter"><div className="fill" style={{ width: pct(distribution[n as 1|2|3|4|5]) + '%' }} /></div>
              <div>{pct(distribution[n as 1|2|3|4|5])}%</div>
            </label>
          ))}
        </div>
      </aside>

      <div>
        <div className="review-controls">
          <div className="search-inp">
            <i className="material-icons" aria-hidden>search</i>
            <input
              type="text"
              placeholder="Søg efter nøgleord..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Søg i anmeldelser"
            />
          </div>
          <div className="sort-sel">
            <button type="button" className="chip" aria-disabled>Flere filtre</button>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sortér anmeldelser">
              <option>Seneste</option>
            </select>
          </div>
        </div>

        <div className="review-list">
          {filtered.map((r) => (
            <article key={r.id} className="review-item">
              <div className="review-head">
                <div className="rev-left">
                  <div className="avatar-sm" aria-hidden>{(r.userName || "").slice(0,2).toUpperCase()}</div>
                  <div className="author-name">{r.userName || 'Anmelder'}</div>
                </div>
                {fmtDate(r.date) && <div className="rev-date">{fmtDate(r.date)}</div>}
              </div>
              <StarBoxes points={r.points} />
              {r.title && <h4 className="review-title-strong">{r.title}</h4>}
              <p>{r.text}</p>
              {fmtDate(r.date) && (
                <div style={{ display:'flex', gap:8, marginTop:8 }}>
                  <span className="mini-tag">{fmtDate(r.date)}</span>
                </div>
              )}
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="review-item" style={{ color: '#64748b' }}>Ingen anmeldelser matcher dine filtre.</div>
          )}
        </div>
      </div>
    </div>
  );
}
