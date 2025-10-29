import "../../styles/reviewform.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StarRating from "../../components/StarRating";
import DatePicker from "../../components/DatePicker";
import { submit } from "./submit";

export default function WriteReviewForm() {
  return (
    <>
      <Header />
      <main className="review-shell">
        <form
          action={async (formData) => {
            "use server";
            await submit(formData);
          }}
        >
          <div className="review-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <StarRating />
            </div>

            <h2 className="review-title">Fortæl os om din oplevelse</h2>

            <textarea
              name="body"
              className="review-textarea"
              placeholder="Hvad gjorde det til en god oplevelse? Hvad gør virksomheden godt? Du hjælper flest mennesker ved at komme med ærlig og konstruktiv feedback."
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
              <button type="submit" className="submit-btn">Send anmeldelse</button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
