import Header from "../components/Header";
import Footer from "../components/Footer";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-gray-900`}>
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </div>
  );
}
