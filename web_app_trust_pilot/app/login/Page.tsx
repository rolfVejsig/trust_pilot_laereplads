import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css"; 
import { login } from "@/authlib";

export default function LoginPage() {

  return (
    <section className={`${styles.loginRoot} ${styles.loginSection} flex min-h-screen items-center justify-center p-6`}>
      <div className={styles.heroShapes} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobCyan}`} />
        <span className={`${styles.blob} ${styles.blobGreen}`} />
        <span className={`${styles.blob} ${styles.blobPink}`} />
      </div>
      <form
        action={async (formData) => {
          "use server";
          await login(formData); //asdsadada
          redirect('/');
        }}
        className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gray-200"
      >
        <div className="text-center space-y-1 mb-2">
          <h1 className="text-2xl font-semibold text-slate-900">Velkommen tilbage</h1>
          <p className="text-sm text-slate-600">Log ind for at anmelde virksomheder</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Brugernavn/Email"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Kodeord"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-sky-500 py-2 font-medium text-white transition hover:bg-sky-600 disabled:opacity-50"
        >Login</button>

        <div className="flex items-center justify-between text-sm">
          <Link href="#" className="text-slate-600 hover:underline">
            Glemt kodeord?
          </Link>
          <p className="text-gray-600">
            Har du ikke en konto?{" "}
            <Link href="/newaccount" className="text-sky-600 hover:underline">Registrer her</Link>
          </p>
        </div>
      </form> 
    </section>
  );
}
