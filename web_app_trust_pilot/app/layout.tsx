import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; // Sørg for at stien passer!

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lærepladser – Anmeld virksomheder",
  description: "Find og anmeld lærepladser ligesom på Trustpilot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-gray-900`}
      >
        <Header />

        <main className="min-h-[70vh]">{children}</main>

        <footer className="bg-gray-100 text-gray-700 mt-12 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Om os</h3>
              <p className="text-sm text-gray-600">
                Find og anmeld lærepladser i hele Danmark.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Kategorier</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li><a className="hover:underline" href="#">Restauranter</a></li>
                <li><a className="hover:underline" href="#">Butikker</a></li>
                <li><a className="hover:underline" href="#">Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Kontakt</h3>
              <p className="text-sm">kontakt@laerepladser.dk</p>
              <p className="text-xs text-gray-500 mt-4">
                © {new Date().getFullYear()} Lærepladser.dk
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
