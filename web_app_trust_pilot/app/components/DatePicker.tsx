"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  name?: string;
  defaultValue?: string; // yyyy-mm-dd
  placeholder?: string;
};

const WEEKDAYS = ["ma", "ti", "on", "to", "fr", "lø", "sø"];
const MONTHS = [
  "januar","februar","marts","april","maj","juni",
  "juli","august","september","oktober","november","december"
];

function toKey(d: Date) {
  return d.toISOString().slice(0,10);
}

function formatDisplay(d?: Date | null) {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth()+1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function DatePicker({ name = "date", defaultValue, placeholder = "dd-mm-åååå" }: Props) {
  const initial = useMemo(() => {
    if (defaultValue) {
      const [y,m,day] = defaultValue.split("-").map(Number);
      if (y && m && day) return new Date(y, m-1, day);
    }
    return null as Date | null;
  }, [defaultValue]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(initial);
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState<number>((selected ?? today).getFullYear());
  const [month, setMonth] = useState<number>((selected ?? today).getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function changeMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function daysInView(y: number, m: number) {
    const first = new Date(y, m, 1);
    const startIdx = (first.getDay() + 6) % 7; 
    const days: Date[] = [];
    for (let i = 0; i < startIdx; i++) {
      days.push(new Date(y, m, i - startIdx + 1)); 
    }
    const last = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= last; d++) days.push(new Date(y, m, d));
    while (days.length % 7 !== 0) days.push(new Date(y, m + 1, days.length % 7));
    return days;
  }

  const visible = useMemo(() => daysInView(year, month), [year, month]);
  const selectedKey = selected ? toKey(selected) : "";
  const todayKey = toKey(today);

  const isoValue = selected ? toKey(selected) : "";
  const displayValue = formatDisplay(selected);

  return (
    <div className="dp-wrap" ref={ref}>
      <input
        className="input"
        value={displayValue}
        onChange={() => {}}
        onClick={() => setOpen((o) => !o)}
        placeholder={placeholder}
        aria-label="Dato for oplevelse"
      />
      <input type="hidden" name={name} value={isoValue} />

      {open && (
        <div className="dp-popover" role="dialog" aria-label="Datovælger">
          <div className="dp-header">
            <button type="button" className="nav" onClick={() => changeMonth(-1)} aria-label="Forrige måned">
              <i className="material-icons" aria-hidden>chevron_left</i>
            </button>
            <div className="month-label">{MONTHS[month]} {year}</div>
            <button type="button" className="nav" onClick={() => changeMonth(1)} aria-label="Næste måned">
              <i className="material-icons" aria-hidden>chevron_right</i>
            </button>
          </div>

          <div className="dp-grid dp-week">
            {WEEKDAYS.map((d) => (
              <div key={d} className="wk">{d}</div>
            ))}
          </div>

          <div className="dp-grid">
            {visible.map((d) => {
              const key = toKey(d);
              const inMonth = d.getMonth() === month;
              const isToday = key === todayKey;
              const isSel = key === selectedKey;
              return (
                <button
                  type="button"
                  key={key + Math.random()}
                  className={`cell ${inMonth ? "in" : "out"} ${isToday ? "today" : ""} ${isSel ? "sel" : ""}`}
                  onClick={() => { setSelected(d); setOpen(false); }}
                  aria-pressed={isSel}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
