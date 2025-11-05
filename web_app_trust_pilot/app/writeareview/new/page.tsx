import "../../styles/homepage.css";
import "../../styles/writeareview.css";
import "../../styles/reviewform.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StarRating from "../../components/StarRating";
import DatePicker from "../../components/DatePicker";
import { submit } from "./submit";
import { GetConnection } from "@/app/api/connection";

async function getCompany(id: number) {
  try {
    const conn = await GetConnection();
    const [rows] = await conn.query(
      `SELECT CompanyId AS id, CompanyName AS name FROM Companies WHERE CompanyId = ? LIMIT 1`,
      [id]
    );
    await conn.end();
    const list = rows as any[];
    if (Array.isArray(list) && list.length) return list[0] as { id:number; name:string };
  } catch {}
  return null;
}

export default async function WriteReviewForm({ searchParams }: { searchParams: Promise<{ company?: string; error?: string }> }) {
  const sp = await searchParams;
  const companyId = Number(sp?.company || 0);
  const company = Number.isFinite(companyId) && companyId > 0 ? await getCompany(companyId) : null;
  const error = sp?.error ? String(sp.error) : "";

  return (
    <>
      <Header />
      <div className="template-style">
        <main className="review-shell">
          <div className="review-card" style={{ marginBottom: 12 }}>
          {company ? (
            <div className="review-sub">Du skriver en anmeldelse for <strong>{company.name}</strong></div>
          ) : (
            <div className="review-sub">Vælg først en virksomhed på <a href="/writeareview">siden med søgning</a>.</div>
          )}
          {error && (
            <div role="alert" style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>
          )}
          </div>
          <form action={submit}>
            <input type="hidden" name="companyId" value={company?.id || 0} />
            <div className="review-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <StarRating />
              </div>

              <h2 className="review-title">Fortæl os om din oplevelse</h2>

              <textarea
                name="body"
                className="review-textarea"
                placeholder="Hvad gjorde det til en god oplevelse? Hvad gør virksomheden godt? Du hjælper flest mennesker ved at komme med ærlig og konstruktiv feedback."
                required
                minLength={5}
              />

              <div className="field">
                <label className="label">Giv din anmeldelse en titel</label>
                <div style={{ position: "relative" }}>
                  <input
                    name="title"
                    className="input"
                    placeholder="Hvad vil du helst fremhæve ved din oplevelse?"
                  />
                  <i className="material-icons" aria-hidden style={{ position: "absolute", right: 10, top: 10, color: "#475569" }}>edit</i>
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="date">Dato for oplevelse</label>
                <div className="date-row">
                  <DatePicker name="date" />
                  <i className="material-icons calendar" aria-hidden>event</i>
                </div>
              </div>
              <div className="submit-row">
                <button type="submit" className="submit-btn" disabled={!company}>Send anmeldelse</button>
              </div>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}
