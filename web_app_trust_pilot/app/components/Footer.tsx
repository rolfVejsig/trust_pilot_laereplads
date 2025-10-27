import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand / Intro */}
        <div className="footer-brand">
          <a href="/" className="brand-title" aria-label="Forside">
            Lærepladser<span className="brand-dot">.</span>
          </a>
          <p className="brand-tagline">Find og anmeld lærepladser du stoler på.</p>
          <div className="socials" aria-label="Følg os">
            <a className="social-link" href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.92 8.44-9.94Z"/>
              </svg>
            </a>
            <a className="social-link" href="#" aria-label="Twitter/X">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M3 3h3.7l5.1 6.9L17.7 3H21l-7.6 9.9L21.5 21H17.8l-5.3-7.4L7 21H3.5l7.7-10.1L3 3Z"/>
              </svg>
            </a>
            <a className="social-link" href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm5.75-.75a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5Z"/>
              </svg>
            </a>
            <a className="social-link" href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05C21 8.65 22 10.7 22 13.7V21h-4v-6.1c0-1.45-.03-3.3-2-3.3c-2 0-2.3 1.56-2.3 3.2V21h-4V9Z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="footer-columns">
          <div className="footer-section">
            <h4 className="footer-title">Virksomhed</h4>
            <ul className="footer-links">
              <li className="footer-list-item">
                <span className="material-icons item-icon">chevron_right</span>
                <a href="#">Om os</a>
              </li>
              <li className="footer-list-item">
                <span className="material-icons item-icon">chevron_right</span>
                <a href="#">Karriere</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li className="footer-list-item">
                <span className="material-icons item-icon">help_outline</span>
                <a href="#">Hjælp & FAQ</a>
              </li>
              <li className="footer-list-item">
                <span className="material-icons item-icon">mail_outline</span>
                <a href="#">Kontakt os</a>
              </li>
              <li className="footer-list-item">
                <span className="material-icons item-icon">policy</span>
                <a href="#">Privatlivspolitik</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Udforsk</h4>
            <ul className="footer-links">
              <li className="footer-list-item">
                <span className="material-icons item-icon">category</span>
                <a href="#">Kategorier</a>
              </li>
              <li className="footer-list-item">
                <span className="material-icons item-icon">rate_review</span>
                <a href="#">Skriv anmeldelse</a>
              </li>
              <li className="footer-list-item">
                <span className="material-icons item-icon">trending_up</span>
                <a href="#">Populære virksomheder</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">© {year} Lærepladser. Alle rettigheder forbeholdes.</div>
    </footer>
  );
};

export default Footer;