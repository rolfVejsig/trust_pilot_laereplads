"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MultiSelectProps = {
  name: string; 
  options: string[];
  placeholder?: string;
  selected?: string[];
};

export default function MultiSelect({ name, options, placeholder = "Søg og vælg…", selected = [] }: MultiSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<string[]>(selected);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  function toggle(value: string) {
    setValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  return (
    <div className="relative" ref={boxRef}>
      {/* tags + input */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400"
        onClick={() => setOpen((s) => !s)}
      >
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 text-xs">
            {v}
            <button type="button" aria-label={`Fjern ${v}`} className="text-indigo-600 hover:text-indigo-800" onClick={(e) => { e.stopPropagation(); toggle(v); }}>
              ×
            </button>
          </span>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 min-w-[140px] border-none outline-none bg-transparent text-sm text-gray-900 placeholder-gray-400"
        />
      </div>

      {open && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">Ingen resultater</div>
          ) : (
            filtered.map((opt) => {
              const checked = values.includes(opt);
              return (
                <label key={opt} className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={checked}
                    onChange={() => toggle(opt)}
                  />
                  <span className="text-gray-800">{opt}</span>
                </label>
              );
            })
          )}
        </div>
      )}

      {/* Hidden inputs for form submission */}
      <div className="hidden">
        {values.map((v) => (
          <input key={v} type="checkbox" name={name} value={v} defaultChecked />
        ))}
      </div>
    </div>
  );
}
