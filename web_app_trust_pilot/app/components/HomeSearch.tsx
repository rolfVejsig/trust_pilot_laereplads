"use client";

import { useEffect, useRef, useState } from "react";

type Company = { id: number; name: string; url: string | null };

type Props = {
  placeholder?: string;
  ariaLabel?: string;
  showOverlay?: boolean;
  footerText?: string;
};

export default function HomeSearch({
  placeholder = "Søg efter virksomhed, branche eller by...",
  ariaLabel = "Søg efter virksomheder",
  showOverlay = true,
  footerText = "Vis alle resultater",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Company[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
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
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="hero-search-wrap" ref={boxRef}>
      {showOverlay && open && (query || loading) && (
        <div className="hero-overlay" onClick={() => setOpen(false)} aria-hidden />
      )}
      <div className="hero-search" onFocus={() => setOpen(true)}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
        <button type="button" onClick={() => setOpen(true)} aria-label="Søg">
          <i className="material-icons">search</i>
        </button>
      </div>

      {open && (query || loading) && (
        <div className="hero-results" role="listbox">
          {loading ? (
            <div className="hero-result hero-loading">Søger…</div>
          ) : results.length === 0 ? (
            <div className="hero-result hero-empty">Ingen virksomheder fundet</div>
          ) : (
            <ul className="hero-list">
              {results.map((c) => (
                <li key={c.id} className="hero-item" role="option">
                  <div className="hero-title">{c.name}</div>
                  {c.url && <div className="hero-sub">{c.url}</div>}
                </li>
              ))}
            </ul>
          )}
          <div className="hero-footer">{footerText}</div>
        </div>
      )}
    </div>
  );
}
