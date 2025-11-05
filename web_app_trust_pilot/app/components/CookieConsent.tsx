"use client";

import { useEffect, useState } from "react";

type Consent = {
  necessary: true;
  preferences: boolean;
  statistics: boolean;
  timestamp: number;
};

const STORAGE_KEY = "cookieConsent";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [prefs, setPrefs] = useState({ preferences: false, statistics: false });

  useEffect(() => {
    // hvis der ikke er sat cookie consent så vis dialogen
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) setOpen(true);
    } catch {
    }

    // tilføj event listener for at åbne cookie dialogen
    const onOpen = () => setOpen(true);
    window.addEventListener("cookie:open", onOpen);
    return () => {
      window.removeEventListener("cookie:open", onOpen);
    };
  }, []);

  // gem cookie consent i local storage
  function saveConsent(all: boolean) {
    const payload: Consent = {
      necessary: true,
      preferences: all ? true : prefs.preferences,
      statistics: all ? true : prefs.statistics,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-sky-100 border border-sky-100">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-6 w-10 rounded bg-sky-600 text-white flex items-center justify-center text-xs font-bold">LP</div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Vi passer på dine data</h2>
              <p className="mt-2 text-sm text-slate-700">
                Vi bruger egne cookies til at forbedre din oplevelse, måle brugen af vores
                platform og vise relevant indhold.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-white shadow hover:bg-sky-600"
              onClick={() => saveConsent(true)}
            >
              Tillad alle
            </button>
            <button
              className="rounded-lg border border-sky-300 bg-white px-4 py-2 font-medium text-sky-700 shadow hover:bg-sky-50"
              onClick={() => saveConsent(false)}
            >
              Tillad udvalgte
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="text-sm font-medium text-sky-700 hover:underline"
              onClick={() => setExpanded((s) => !s)}
              aria-expanded={expanded}
            >
              {expanded ? "Skjul valgte cookies" : "Se valgte cookies"}
            </button>

            {expanded && (
              <div className="mt-3 space-y-2 rounded-lg border border-slate-200 p-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked disabled className="h-4 w-4 accent-sky-500" />
                  Nødvendige (altid aktive)
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-sky-500"
                    checked={prefs.preferences}
                    onChange={(e) => setPrefs((p) => ({ ...p, preferences: e.target.checked }))}
                  />
                  Præferencer
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-sky-500"
                    checked={prefs.statistics}
                    onChange={(e) => setPrefs((p) => ({ ...p, statistics: e.target.checked }))}
                  />
                  Statistik
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
