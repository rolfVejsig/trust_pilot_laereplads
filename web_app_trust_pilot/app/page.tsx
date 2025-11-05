import "./styles/homepage.css";
import "./styles/company.css"; // reuse star box styles
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import HomeSearch from "./components/HomeSearch";
import { GetConnection } from "./api/connection";

type LatestReview = {
  id: number;
  points: number;
  body: string;
  title?: string;
  date?: string;
  companyId: number;
  companyName: string;
};

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

async function getLatestReviews(limit = 8): Promise<LatestReview[]> {
  try {
    const conn = await GetConnection();
    // Discover column names dynamically to handle schema changes
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
      'u.UserName AS userName',
      'c.CompanyId AS companyId',
      'c.CompanyName AS companyName'
    ].join(',\n              ');

    const [rows] = await conn.query(
      `SELECT ${selectFields}
       FROM Ratings r
       JOIN Users u ON u.UserId = r.Rater
       JOIN Companies c ON c.CompanyId = r.Company
       WHERE u.UserEmail NOT LIKE '%@example.com'
       ORDER BY r.RatingId DESC
       LIMIT ?`,
      [limit]
    );
    await conn.end();
    const list = rows as any[];
    return (Array.isArray(list) ? list : []).map(r => ({
      id: Number(r.id),
      points: Number(r.points),
      body: String(r.body || ""),
      title: r.title ? String(r.title) : undefined,
      date: r.date ? String(r.date) : undefined,
      companyId: Number(r.companyId),
      companyName: String(r.companyName || ""),
    } as LatestReview));
  } catch (e) {
    console.error("Kunne ikke hente seneste anmeldelser:", e);
    return [];
  }
}

export default async function Home() {
  const latest = await getLatestReviews(8);
  return (
    <>
      <Header />
      <div className="template-style">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-shapes" aria-hidden="true">
          <span className="blob blob-orange" />
          <span className="blob blob-green" />
          <span className="blob blob-pink" />
        </div>
        <div className="hero-content">
          <h2>Lærepladser – Anmeld virksomheder</h2>
          <h1>Find en læreplads du stoler på</h1>
          <HomeSearch />
        </div>
      </section>

      {/* Welcome Blue Box */}
      <section className="welcome-section">
        <div className="welcome-container">
          <div className="welcome-card">
            <span className="welcome-icon" aria-hidden="true">
              <i className="material-icons">info</i>
            </span>
            <div className="welcome-content">
              <h3>Velkommen til Lærepladser</h3>
                <p>
                  Find og del erfaringer om lærepladser, virksomheder og brancher. Vi hjælper elever og lærlinge med at
                  tage bedre valg – og virksomheder med at blive set for det, de gør godt.
                </p>
                <div className="welcome-socials" aria-label="Følg os på sociale medier">
                  <span className="label">Følg os:</span>
                  <a className="welcome-social" href="#" aria-label="Facebook" title="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M22 12.06C22 6.48 17.52 2 11.94 2 6.36 2 1.88 6.48 1.88 12.06c0 4.93 3.6 9.02 8.31 9.9v-7h-2.5v-2.9h2.5V9.9c0-2.46 1.46-3.82 3.7-3.82 1.07 0 2.18.19 2.18.19v2.4h-1.23c-1.21 0-1.59.75-1.59 1.52v1.83h2.71l-.43 2.9h-2.28v7C18.4 21.08 22 16.99 22 12.06z"/>
                    </svg>
                  </a>
                  <a className="welcome-social" href="#" aria-label="X (Twitter)" title="X (Twitter)">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.53 3H20l-5.43 6.2L21.5 21h-6.16l-4.27-6.17L5.96 21H3.5l5.9-6.73L2.7 3h6.3l3.77 5.44L17.53 3Zm-1.08 16h1.69L7.67 5h-1.7l10.48 14Z"/>
                    </svg>
                  </a>
                  <a className="welcome-social" href="#" aria-label="Instagram" title="Instagram">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6.001 3 3 0 0 1 0 6Zm5.9-7.93a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2ZM12 2c3.2 0 3.584.013 4.847.07 1.26.058 2.123.258 2.87.552.777.305 1.435.713 2.085 1.363.65.65 1.058 1.308 1.363 2.085.294.747.494 1.61.552 2.87.057 1.263.07 1.647.07 4.847s-.013 3.584-.07 4.847c-.058 1.26-.258 2.123-.552 2.87-.305.777-.713 1.435-1.363 2.085-.65.65-1.308 1.058-2.085 1.363-.747.294-1.61.494-2.87.552-1.263.057-1.647.07-4.847.07s-3.584-.013-4.847-.07c-1.26-.058-2.123-.258-2.87-.552-.777-.305-1.435-.713-2.085-1.363-.65-.65-1.058-1.308-1.363-2.085-.294-.747-.494-1.61-.552-2.87C2.013 15.584 2 15.2 2 12s.013-3.584.07-4.847c.058-1.26.258-2.123.552-2.87.305-.777.713-1.435 1.363-2.085.65-.65 1.308-1.058 2.085-1.363.747-.294 1.61-.494 2.87-.552C8.416 2.013 8.8 2 12 2Zm0 1.8c-3.137 0-3.506.012-4.743.068-1.145.052-1.767.244-2.178.406-.548.213-.94.467-1.352.879-.412.412-.666.804-.879 1.352-.162.41-.354 1.033-.406 2.178C2.386 9.92 2.375 10.288 2.375 12.5s.011 2.58.067 3.817c.052 1.145.244 1.767.406 2.178.213.548.467.94.879 1.352.412.412.804.666 1.352.879.41.162 1.033.354 2.178.406 1.237.056 1.606.067 4.743.067s3.506-.011 4.743-.067c1.145-.052 1.767-.244 2.178-.406.548-.213.94-.467 1.352-.879.412-.412.666-.804.879-1.352.162-.41.354-1.033.406-2.178.056-1.237.067-1.606.067-4.743s-.011-3.506-.067-4.743c-.052-1.145-.244-1.767-.406-2.178-.213-.548-.467-.94-.879-1.352-.412-.412-.804-.666-1.352-.879-.41-.162-1.033-.354-2.178-.406C15.506 3.812 15.137 3.8 12 3.8Z"/>
                    </svg>
                  </a>
                  <a className="welcome-social" href="#" aria-label="LinkedIn" title="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.55v-5.62c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.72H9.33V9.56h3.41v1.49h.05c.47-.89 1.63-1.83 3.35-1.83 3.58 0 4.24 2.36 4.24 5.42v5.81ZM5.34 8.07a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9.56h3.56v10.89Z"/>
                    </svg>
                  </a>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Small info pill like Trustpilot */}
      <div className="info-strip">
        <div className="info-pill" role="note">
          Arbejder du på en læreplads?&nbsp;
          <a href="/writeareview" aria-label="Skriv en anmeldelse">Skriv en anmeldelse</a>
          <i className="material-icons" aria-hidden>chevron_right</i>
        </div>
      </div>

      {/* Categories Section (compact chips like Trustpilot) */}
      <section className="categories">
        <h2>Populære kategorier</h2>
        <div className="category-strip">
          {[
            { label: "Tømrer", icon: "handyman", variant: "yellow" },
            { label: "Smed", icon: "precision_manufacturing", variant: "green" },
            { label: "IT", icon: "computer", variant: "blue" },
            { label: "Elektriker", icon: "electrical_services", variant: "purple" },
            { label: "Murer", icon: "foundation", variant: "pink" },
            { label: "VVS", icon: "plumbing", variant: "green" },
            { label: "Butik", icon: "storefront", variant: "yellow" },
            { label: "Kontor", icon: "work", variant: "blue" },
          ].map((c) => (
            <div key={c.label} className="category-item">
              <span className={`category-icon variant-${c.variant}`}>
                <i className="material-icons">{c.icon}</i>
              </span>
              <span className="category-label">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="business-cta peach" aria-label="Virksomheds-CTA">
        <div className="band">
          <p>
            Vil du gerne have din virksomhed til at vokse? Styrk dit omdømme med anmeldelser fra Lærepladser.
          </p>
            <a href="/newaccount" className="cta-btn">Kom i gang</a>
        </div>
      </section>

      <section className="best-category">
        <div className="section-head">
          <h3>Bedst i kategorien Tømmer</h3>
          <a href="#" className="see-more">Se mere</a>
        </div>
        <div className="best-scroller">
          {[
            { name: "Tømmer1", site: "Tømmer.dk", logo: "T1" },
            { name: "Tømmer2", site: "Tømmer.dk", logo: "T2" },
            { name: "Tømmer3", site: "Tømmer.dk", logo: "T3" },
            { name: "Tømmer4", site: "Tømmer.dk", logo: "T4" },
          ].map((b) => (
            <div key={b.name} className="best-card">
              <div className="logo-box" aria-hidden="true">{b.logo}</div>
              <div className="company-name">{b.name}</div>
              <div className="company-site">{b.site}</div>
              <div className="trust-badges">
                <span className="stars">
                  <i className="material-icons">star</i>
                  <i className="material-icons">star</i>
                  <i className="material-icons">star</i>
                  <i className="material-icons">star</i>
                  <i className="material-icons">star_half</i>
                </span>
                <span className="score">4.7 (1.3k)</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="best-category">
        <div className="section-head">
          <h3>Smed</h3>
          <a href="#" className="see-more">Se mere</a>
        </div>
        <div className="best-scroller">
          {[
            { name: "Smed1", site: "smed.dk", logo: "SM1" },
            { name: "Smed2", site: "smed.dk", logo: "SM2" },
            { name: "Smed3", site: "smed.dk", logo: "SM3" },
            { name: "Smed4", site: "smed.dk", logo: "SM4" },
          ].map((b) => (
            <div key={b.name} className="best-card">
              <div className="logo-box" aria-hidden="true">{b.logo}</div>
              <div className="company-name">{b.name}</div>
              <div className="company-site">{b.site}</div>
              <div className="trust-badges">
                <span className="stars">
                  <i className="material-icons">star</i>
                  <i className="material-icons">star</i>
                  <i className="material-icons">star</i>
                  <i className="material-icons">star</i>
                  <i className="material-icons">star</i>
                </span>
                <span className="score">4.8 (776)</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo panel with images */}
      <section className="promo-panel">
        <div className="panel">
          <div>
            <h4>Hjælp flere elever med at træffe de rigtige valg</h4>
            <p>Del din oplevelse på Lærepladser, så andre kan finde den rette virksomhed og læreplads.</p>
            <a href="/login" className="cta" aria-label="Log ind">
              Log ind
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <h2>Seneste Anmeldelser</h2>
        <div className="reviews-grid">
          {latest.length === 0 ? (
            <div className="review-card">Der er endnu ingen anmeldelser.</div>
          ) : (
            latest.map((r) => (
              <a key={r.id} className="review-card" href={`/review/${r.companyId}`} aria-label={`Se ${r.companyName}`}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 6 }}>
                  <StarBoxes points={r.points} />
                  {r.date && (
                    <span style={{ color:'#64748b', fontSize: 12 }}>
                      {(() => {
                        const t = new Date(r.date!);
                        return isNaN(t.getTime()) ? r.date : t.toLocaleDateString('da-DK', { day:'2-digit', month:'long', year:'numeric' });
                      })()}
                    </span>
                  )}
                </div>
                {r.title && <h4 style={{ margin: '4px 0 8px', fontWeight: 800, color: '#0f172a', fontSize: 16 }}>{r.title}</h4>}
                <p style={{ margin: 0 }}>
                  {r.body.length > 160 ? r.body.slice(0, 157) + "…" : r.body}
                </p>
                <div style={{ marginTop: 10, color: '#64748b', fontSize: 13 }}>{r.companyName}</div>
              </a>
            ))
          )}
        </div>
      </section>

      {/* App banner */}
      <section className="app-banner">
        <div className="app-card">
          <div className="app-left">
            <div className="app-phone" aria-hidden="true" />
            <div className="app-text">
              <h5>Tryghed med Lærepladser-appen</h5>
              <p>Hold styr på anmeldelser og virksomheder – når som helst.</p>
            </div>
          </div>
          <div className="store-btns">
            <a href="#" className="store-btn" aria-label="Hent i App Store">App Store</a>
            <a href="#" className="store-btn" aria-label="Hent i Google Play">Google Play</a>
          </div>
        </div>
      </section>
      </div>
      <Footer />
      <CookieConsent />
    </>
  );
}
