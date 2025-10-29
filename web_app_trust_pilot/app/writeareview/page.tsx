import "../styles/homepage.css";
import "../styles/writeareview.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WriteAReview() {
	return (
		<>
			<Header />
			<div className="template-style write-wrapper">
				<section className="hero" aria-labelledby="write-title">
					<div className="hero-shapes" aria-hidden="true">
						<span className="blob blob-orange" />
						<span className="blob blob-green" />
						<span className="blob blob-pink" />
					</div>
					<div className="hero-content">
						<h1 id="write-title">Del din oplevelse</h1>
						<p style={{ margin: "0 0 16px", color: "#334155" }}>
							Hjælp andre med at træffe de rigtige valg.
						</p>
						<div className="hero-search" role="search" aria-label="Find virksomhed for anmeldelse">
							<input
								type="text"
								placeholder="Find en virksomhed at anmelde"
								aria-label="Søg virksomhed"
							/>
							<button aria-label="Søg">
								<i className="material-icons" aria-hidden>
									search
								</i>
							</button>
						</div>
					</div>
				</section>

						<section className="write-cta" aria-label="Skriv anmeldelse CTA">
							<p>Er der en virksomhed du ikke kan finde?</p>
							<a href="/writeareview/new" className="add-btn">
								Tilføj virksomhed
								<i className="material-icons" aria-hidden>chevron_right</i>
							</a>
				</section>
			</div>
			<Footer />
		</>
	);
}
