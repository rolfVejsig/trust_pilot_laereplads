import "./styles/homepage.css";

export default function Home() {
  return (
    <div className="template-style">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Lærepladser – Anmeld virksomheder</h2>
          <h1>Find en læreplads du stoler på</h1>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Søg efter virksomhed, branche eller by..."
            />
            <button>
              <i className="material-icons">search</i>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section (compact chips like Trustpilot) */}
      <section className="categories">
        <h2>Populære kategorier</h2>
        <div className="category-strip">
          {[
            { label: "Tømrer", icon: "handyman" },
            { label: "Smed", icon: "precision_manufacturing" },
            { label: "IT", icon: "computer" },
            { label: "Elektriker", icon: "electrical_services" },
            { label: "Murer", icon: "foundation" },
            { label: "VVS", icon: "plumbing" },
            { label: "Butik", icon: "storefront" },
            { label: "Kontor", icon: "work" },
          ].map((c) => (
            <div key={c.label} className="category-item">
              <span className="category-icon">
                <i className="material-icons">{c.icon}</i>
              </span>
              <span className="category-label">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <h2>Seneste Anmeldelser</h2>
        <div className="reviews-grid">
          {[1, 2, 3].map((review) => (
            <div key={review} className="review-card">
              <p>"Fantastisk læreplads! Jeg lærte så meget." - Tømrer</p>
              <div className="stars">
                <i className="material-icons">star</i>
                <i className="material-icons">star</i>
                <i className="material-icons">star</i>
                <i className="material-icons">star</i>
                <i className="material-icons" style={{ color: '#d1d5db' }}>star</i>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
