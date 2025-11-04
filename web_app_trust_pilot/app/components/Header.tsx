'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{id:number; name:string; url:string|null}>>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent){
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(Array.isArray(data.companies) ? data.companies : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo" aria-label="Forside">
          Lærepladser<span className="logo-dot">.</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link href="/categories" className="nav-link">
            Kategorier
          </Link>
        </nav>

        <div className="search-wrap" ref={boxRef}>
          <div className="search-bar" onFocus={() => setOpen(true)}>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              placeholder="Søg efter virksomheder..."
              className="search-input"
            />
            <button className="search-button" type="button" onClick={() => setOpen(true)}>Søg</button>
          </div>

          {open && (query || loading) && (
            <div className="search-results">
              {loading ? (
                <div className="search-loading">Søger…</div>
              ) : results.length === 0 ? (
                <div className="search-empty">Ingen virksomheder fundet</div>
              ) : (
                <ul className="search-list" role="listbox">
                  {results.map((c) => (
                    <li key={c.id} className="search-item" role="option">
                      <div className="company-title">{c.name}</div>
                      {c.url && <div className="company-sub">{c.url}</div>}
                      <span className="pill-score">Demo</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="search-footer">Vis alle resultater</div>
            </div>
          )}
        </div>

        <div className="actions">
          <Link href="/writeareview" className="action-button primary">
            Skriv anmeldelse
          </Link>
          <Link href="/login" className="action-button secondary">
            Log ind
          </Link>
        </div>

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
