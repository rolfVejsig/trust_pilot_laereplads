'use client';

import { useState } from 'react';
import Link from 'next/link';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link href="/" className="logo" aria-label="Forside">
          Lærepladser<span className="logo-dot">.</span>
        </Link>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link href="/categories" className="nav-link">
            Kategorier
          </Link>
          <Link href="/new" className="nav-link">
            Nyheder
          </Link>
          <Link href="/deals" className="nav-link">
            Tilbud
          </Link>
        </nav>

        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Søg efter virksomheder..."
            className="search-input"
          />
          <button className="search-button">Søg</button>
        </div>

        {/* Action buttons */}
        <div className="actions">
          <Link href="/writeareview" className="action-button primary">
            Skriv anmeldelse
          </Link>
          <Link href="/login" className="action-button secondary">
            Log ind
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-button"
          aria-label="Menu"
        >
          {menuOpen ? 'Luk' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
