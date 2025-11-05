import "@/app/styles/company.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { GetConnection } from "@/app/api/connection";

async function getCompany(id: number) {
  try {
    const conn = await GetConnection();
    const [rows] = await conn.query(
      `SELECT CompanyId AS id, CompanyName AS name, WebpageURL AS url
       FROM Companies WHERE CompanyId = ? LIMIT 1`,
      [id]
    );
    await conn.end();
    const list = rows as any[];
    if (Array.isArray(list) && list.length) return list[0] as { id:number; name:string; url:string|null };
  } catch (e) {
    console.error("Kunne ikke hente virksomhed:", e);
  }
  return { id, name: "Ukendt virksomhed", url: null };
}

export default async function CompanyPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const company = await getCompany(Number.isFinite(id) ? id : 0);

  return (
    <>
      <Header />
      <main className="company-shell">
        {/* breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Brødkrummer">
          <a href="/">Forside</a>
          <span>/</span>
          <a href="/categories">Kategorier</a>
          <span>/</span>
          <span aria-current="page">{company.name}</span>
        </nav>

        {/* hero/top section */}
        <section className="company-hero">
          <div className="company-card">
            <div className="company-head">
              <div className="logo-box" aria-hidden>
                {(company.name || "").slice(0,2).toUpperCase()}
              </div>
              <div>
                <div className="company-name">{company.name}</div>
                <div className="company-meta">Restaurant • København • Ikke-tilknyttet profil</div>
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
              <article className="review-teaser">
                <div style={{color:'#10b981'}}>★★★★★</div>
                <h4 style={{margin:'6px 0'}}>Super oplevelse</h4>
                <p>Rigtig god mad og venligt personale. Kan anbefales!</p>
              </article>
              <article className="review-teaser">
                <div style={{color:'#10b981'}}>★★★★☆</div>
                <h4 style={{margin:'6px 0'}}>God service</h4>
                <p>Vi blev taget godt imod, og alt spillede.</p>
              </article>
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

          {/* right aside score */}
          <aside className="aside-card" aria-label="TrustScore">
            <div className="score-num">4,6</div>
            <div className="score-label">Fremragende</div>
            <div style={{color:'#334155', fontSize:12, marginTop:2}}>27 anmeldelser</div>
            <div className="bars">
              {[5,4,3,2,1].map((n, i) => (
                <div key={n} className="bar">
                  <div>{n} stjerner</div>
                  <div className="meter"><div className="fill" style={{width: [82,7,0,0,11][i] + '%'}} /></div>
                  <div>{[82,7,0,0,11][i]}%</div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* all reviews */}
        <section className="all-reviews">
          <div className="filters">
            <h4 style={{marginTop:0}}>Alle anmeldelser</h4>
            <div style={{fontSize:12, color:'#64748b'}}>Filtre, sortering og søgning (skelet)</div>
          </div>
          <div>
            <div className="review-list">
              {[1,2,3].map((i) => (
                <article key={i} className="review-item">
                  <div style={{color:'#10b981'}}>★★★★☆</div>
                  <h4 style={{margin:'6px 0'}}>Lækker frokost</h4>
                  <p>Spiste en rigtig god frokost med venlig betjening. Alt i alt en god oplevelse til en fair pris.</p>
                  <div style={{color:'#64748b', fontSize:12}}>19. januar 2024 · Uopfordret anmeldelse</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
