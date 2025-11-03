"use client";
import { useState } from "react";

type Props = {
    name?: string;
    initial?: number;
    size?: number;
};

export default function StarRating({ name = "rating", initial = 0, size = 70 }: Props) {
    const [value, setValue] = useState<number>(initial);
    const [hover, setHover] = useState<number>(0);

    const stars = [1, 2, 3, 4, 5];

    const SCALE = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e"];
    const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
    const currentLevel = clamp(hover || value || 0 || 0);
    const currentColor = SCALE[currentLevel - 1];
    const alpha = (hex: string, a = 0.15) => {
        const m = hex.replace("#", "");
        const r = parseInt(m.substring(0, 2), 16);
        const g = parseInt(m.substring(2, 4), 16);
        const b = parseInt(m.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    return (
        <div className="rating" aria-label="Vælg antal stjerner" role="radiogroup">
            <input type="hidden" name={name} value={value} />
            {stars.map((n) => {
                const active = (hover || value) >= n;
                return (
                    <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={value === n}
                        aria-label={`${n} ${n === 1 ? "stjerne" : "stjerner"}`}
                        className={`star ${active ? "active" : ""}`}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setValue(n)}
                        style={{
                            width: size,
                            height: size,
                            color: active ? currentColor : undefined,
                            borderColor: active ? currentColor : "#d1d5db",
                            background: active ? alpha(currentColor, 0.12) : undefined,
                        }}
                    >
                        <i className="material-icons" aria-hidden>
                            {active ? "star" : "star_border"}
                        </i>
                    </button>
                );
            })}
        </div>
    );
}
