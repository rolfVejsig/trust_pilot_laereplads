import "@/app/styles/company.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ReviewList from "@/app/components/ReviewList";
import { GetConnection } from "@/app/api/connection";

type Company = { id: number; name: string; url: string | null };
type Review = { id: number; points: number; text: string; title?: string; date?: string; userName: string };

function stars(points: number) {
  const p = Math.max(0, Math.min(5, Math.round(points)));
  return "★".repeat(p) + "☆".repeat(5 - p);
}

function labelFor(score: number) {
  if (score >= 4.5) return "Fremragende";
  if (score >= 3.5) return "God";
  if (score >= 2.5) return "Middel";
  if (score >= 1.5) return "Dårlig";
  return "Meget dårlig";
}

const STAR_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e"]; // 1..5
function colorFor(points: number) {
  const p = Math.max(1, Math.min(5, Math.round(points)));
  return STAR_COLORS[p - 1];
}

function StarBoxes({ points }: { points: number }) {
  const p = Math.max(0, Math.min(5, Math.round(points)));
  return (
    <div className="stars-box" aria-label={`${p} ud af 5 stjerner`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= p;
        const col = colorFor(points);
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

async function getCompanyAndReviews(id: number) {
  const fallback = { company: { id, name: "Ukendt virksomhed", url: null } as Company, reviews: [] as Review[], avg: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1|2|3|4|5, number> };
  try {
    if (!Number.isFinite(id) || id <= 0) return fallback;
    const conn = await GetConnection();

    const [cRows] = await conn.query(
      `SELECT CompanyId AS id, CompanyName AS name, WebpageURL AS url FROM Companies WHERE CompanyId = ? LIMIT 1`,
      [id]
    );
    const cList = cRows as any[];
    if (!Array.isArray(cList) || !cList.length) {
      await conn.end();
      return fallback;
    }
    const company = cList[0] as Company;

    // Discover rating columns dynamically to adapt to schema changes
  const [cols] = await conn.query(`SHOW COLUMNS FROM Ratings`);
  const names = new Set((cols as any[]).map(c => String(c.Field)));
  const textCol = names.has('Text') ? 'Text' : (names.has('ReviewText') ? 'ReviewText' : 'RatingText');
  const titleCol = names.has('Title') ? 'Title' : (names.has('ReviewTitle') ? 'ReviewTitle' : (names.has('RatingTitle') ? 'RatingTitle' : null));
  const dateCol = names.has('ReviewDate') ? 'ReviewDate' : (names.has('Date') ? 'Date' : (names.has('CreatedAt') ? 'CreatedAt' : (names.has('RatingDate') ? 'RatingDate' : null)));

    const selectFields = [
      'r.RatingId AS id',
      'r.Points AS points',
      `r.${textCol} AS body`,
      titleCol ? `r.${titleCol} AS title` : 'NULL AS title',
      dateCol ? `r.${dateCol} AS date` : 'NULL AS date',
      'u.UserName AS userName'
    ].join(', ');

    const [rRows] = await conn.query(
      `SELECT ${selectFields}
       FROM Ratings r JOIN Users u ON u.UserId = r.Rater
       WHERE r.Company = ? AND u.UserEmail NOT LIKE '%@example.com'
       ORDER BY r.RatingId DESC`,
      [id]
    );
    const reviews = (rRows as any[]).map(r => ({
      id: Number(r.id),
      points: Number(r.points),
      text: String(r.body || ""),
      title: r.title ? String(r.title) : undefined,
      date: r.date ? String(r.date) : undefined,
      userName: String(r.userName || ""),
    })) as Review[];

    const [aRows] = await conn.query(
      `SELECT IFNULL(AVG(r.Points), 0) AS avgScore, COUNT(*) AS reviewCount
       FROM Ratings r JOIN Users u ON u.UserId = r.Rater
       WHERE r.Company = ? AND u.UserEmail NOT LIKE '%@example.com'`,
      [id]
    );
    const agg = Array.isArray(aRows) && aRows.length ? (aRows as any[])[0] : { avgScore: 0, reviewCount: 0 };

    const [dRows] = await conn.query(
      `SELECT r.Points, COUNT(*) AS cnt
       FROM Ratings r JOIN Users u ON u.UserId = r.Rater
       WHERE r.Company = ? AND u.UserEmail NOT LIKE '%@example.com'
       GROUP BY r.Points`,
      [id]
    );
    await conn.end();

    const dist: Record<1|2|3|4|5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of dRows as any[]) {
      const p = Number(row.Points);
      if (p >= 1 && p <= 5) dist[p as 1|2|3|4|5] = Number(row.cnt) || 0;
    }

    return { company, reviews, avg: Number(agg.avgScore) || 0, count: Number(agg.reviewCount) || 0, distribution: dist };
  } catch (e) {
    console.error("Kunne ikke hente virksomhed/anmeldelser:", e);
    return fallback;
  }
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const id = Number(p.id);
  const { company, reviews, avg, count, distribution } = await getCompanyAndReviews(id);

  const avgLabel = labelFor(avg);
  const pct = (n: number) => (count ? Math.round((n / count) * 100) : 0);
  const distPercents = [5,4,3,2,1].map(s => pct(distribution[s as 1|2|3|4|5]));
  const starRow = (points: number) => <StarBoxes points={points} />;
  const fmtDate = (d?: string) => {
    if (!d) return null;
    const t = new Date(d);
    if (isNaN(t.getTime())) return d;
    return t.toLocaleDateString('da-DK', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Header />
      <main className="company-shell">
        <nav className="breadcrumbs" aria-label="Brødkrummer">
          <a href="/">Forside</a>
          <span>/</span>
          <a href="/categories">Kategorier</a>
          <span>/</span>
          <span aria-current="page">{company.name}</span>
        </nav>

        <section className="company-hero">
          <div className="company-card">
            <div className="company-head">
              <div className="logo-box" aria-hidden>
                {(company.name || "").slice(0,2).toUpperCase()}
              </div>
              <div>
                <div className="company-name">{company.name}</div>
                <div className="company-meta">Ikke-tilknyttet profil</div>
                <div className="company-actions">
                  <a href={`/writeareview/new?company=${company.id}`} className="btn primary">Skriv en anmeldelse</a>
                  {company.url && (
                    <a href={company.url} className="btn" target="_blank" rel="noopener noreferrer">Besøg websitet</a>
                  )}
                </div>
              </div>
            </div>

            <div className="notice">
              Virksomheder på Lærepladser må ikke tilbyde incitamenter eller betale for at skjule anmeldelser.
            </div>

            <h3 className="section-title">Se, hvad kunderne siger</h3>
            <div className="review-grid">
              {(reviews.slice(0,2)).map(r => (
                <article key={r.id} className="review-teaser">
                  <div className="review-head">
                    <div className="rev-left">
                      <div className="avatar-sm" aria-hidden>{(r.userName || "").slice(0,2).toUpperCase()}</div>
                      <div className="author-name">{r.userName || "Anmelder"}</div>
                    </div>
                    {fmtDate(r.date) && <div className="rev-date">{fmtDate(r.date)}</div>}
                  </div>
                  {starRow(r.points)}
                  <h4 className="review-title-strong">{r.title || ""}</h4>
                  <p>{r.text}</p>
                </article>
              ))}
              {reviews.length === 0 && (
                <div style={{color:'#64748b'}}>Ingen anmeldelser endnu. Vær den første til at skrive en.</div>
              )}
            </div>

            <div className="divider" />

            <section className="company-info">
              <h4 style={{margin:'0 0 8px'}}>Virksomhedsoplysninger</h4>
              <div style={{color:'#334155', fontSize:14}}>Oplysningerne stammer fra forskellige kilder og kan være ufuldstændige.</div>
            </section>

            <div className="divider" />

            <section className="contact">
              <h4 style={{margin:'0 0 8px'}}>Kontaktoplysninger</h4>
              {company.url ? (
                <a href={company.url} target="_blank" rel="noopener noreferrer">{company.url}</a>
              ) : (
                <div style={{color:'#64748b'}}>Ingen hjemmeside angivet</div>
              )}
            </section>
          </div>

          <aside className="aside-card" aria-label="TrustScore">
            <div className="score-num">{avg.toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
            <div className="score-label">{count ? avgLabel : 'Ingen vurdering endnu'}</div>
            <div style={{color:'#334155', fontSize:12, marginTop:2}}>{count} {count === 1 ? 'anmeldelse' : 'anmeldelser'}</div>
            <div className="bars">
              {[5,4,3,2,1].map((n, i) => (
                <div key={n} className="bar">
                  <div>{n} stjerner</div>
                  <div className="meter"><div className="fill" style={{width: distPercents[i] + '%'}} /></div>
                  <div>{distPercents[i]}%</div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        
          <section aria-labelledby="all-reviews-title">
            <h4 id="all-reviews-title" style={{marginTop:0, marginBottom: 8}}>Alle anmeldelser</h4>
            <ReviewList reviews={reviews} avg={avg} count={count} distribution={distribution} />
          </section>
      </main>
      <Footer />
    </>
  );
}
