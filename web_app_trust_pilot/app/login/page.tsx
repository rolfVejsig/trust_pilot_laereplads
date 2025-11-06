import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css"; 
import { login } from "@/authlib";
import { getSessionUser } from "@/authlib";
import ErrorBanner from "./ErrorBanner";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SP = { [key: string]: string | string[] | undefined };

export default async function LoginPage({ searchParams }: { searchParams?: SP }) {
  const errParam = searchParams?.error;
  const rtParam = searchParams?.returnTo;
  const error = Array.isArray(errParam) ? (errParam[0] || "") : (errParam || "");
  const returnTo = Array.isArray(rtParam) ? (rtParam[0] || "/") : (rtParam || "/");
  const user = await getSessionUser();
  if (user) {
    redirect(returnTo || "/");
  }

  return (
    <section className={`${styles.loginRoot} ${styles.loginSection} flex flex-col min-h-screen items-center justify-center p-6`}>
      <div className={styles.heroShapes} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobCyan}`} />
        <span className={`${styles.blob} ${styles.blobGreen}`} />
        <span className={`${styles.blob} ${styles.blobPink}`} />
      </div>
      <form
        action={async (formData) => {
          "use server";
          try {
            await login(formData);
            const rt = String(formData.get('returnTo') || '/') || '/';
            redirect(rt);
          } catch (e: any) {
            const msg = e?.message ? String(e.message) : 'Kunne ikke logge ind';
            const rt = String(formData.get('returnTo') || '/') || '/';
            redirect(`/login?error=${encodeURIComponent(msg)}&returnTo=${encodeURIComponent(rt)}`);
          }
        }}
        className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gray-200"
      >
        <div className="text-center space-y-1 mb-2">
          <h1 className="text-2xl font-semibold text-slate-900">Velkommen tilbage</h1>
          <p className="text-sm text-slate-600">Log ind for at anmelde virksomheder</p>
        </div>

        <div className="space-y-4">
          <input type="hidden" name="returnTo" value={returnTo} />
          <input
            type="text"
            name="username"
            placeholder="Brugernavn/Email"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Kodeord"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <ErrorBanner />

        <button
          type="submit"
          className="w-full rounded-lg bg-sky-500 py-2 font-medium text-white transition hover:bg-sky-600 disabled:opacity-50"
        >Log ind</button>

        <div className="flex items-center justify-between text-sm">
          <Link href="/forgotpassword" className="text-sky-600 hover:underline">
            Glemt kodeord?
          </Link>
          <p className="text-gray-600">
            Har du ikke en konto?{" "}
            <Link href="/newaccount" className="text-sky-600 hover:underline">Registrer her</Link>
          </p>
        </div>
      </form> 
      {/* Business CTA like Trustpilot */}
  <div className="w-full max-w-3xl mt-8 text-center select-none">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Kommer du fra en virksomhed?</h2>
        <p className="text-slate-600 mb-4">Opret en virksomhedskonto gratis</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/companylogin" className="rounded-full bg-sky-600 text-white px-5 py-2 font-semibold hover:bg-sky-700">Log ind</Link>
          <Link href="/newcompany" className="rounded-full border border-sky-600 text-sky-700 px-5 py-2 font-semibold hover:bg-sky-50">Tilmeld dig</Link>
        </div>
      </div>
    </section>
  );
}