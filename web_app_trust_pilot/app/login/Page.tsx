import { redirect } from "next/navigation";
import Link from "next/link";
import { login } from "./login";
import styles from "./login.module.css"; 

export default function LoginPage() {

  return (
    <section className={`${styles.loginRoot} flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-6`}>
      <form
        action={async (formData) => {
          "use server";
          await login(formData);
          redirect("/");
        }}
        className="w-full max-w-sm space-y-6 rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-md border border-white/20"
      >
        <h1 className="text-2xl font-semibold text-white text-center mb-4">
          Velkommen tilbage
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Brugernavn/Email"
            className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Kodeord"
            className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 py-2 font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
        >Login</button>

        <p className="text-sm text-center text-gray-300">
          Ingen account i nu?{" "}
          <Link href="/newaccount" className="text-blue-400 hover:underline">
            Registrer her.</Link>
        </p>
      </form> 
    </section>
  );
}
