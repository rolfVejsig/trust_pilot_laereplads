"use client";

import React from "react";

export default function CookieSettingsLink({ className = "" }: { className?: string }) {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    try {
      localStorage.removeItem("cookieConsent");
    } catch {}
    window.dispatchEvent(new CustomEvent("cookie:open"));
  }

  return (
    <a href="#" className={className} onClick={onClick} role="button">
      Cookieindstillinger
    </a>
  );
}
