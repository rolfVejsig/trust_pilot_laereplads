import styles from "./forgot.module.css";
import Link from "next/link";
import { sendReset } from "./send";

export default function ForgotPassword() {
	return (
		<section className={`${styles.forgotRoot} ${styles.forgotSection} flex min-h-screen items-center justify-center p-6`}>
			<div className={styles.heroShapes} aria-hidden="true">
				<span className={`${styles.blob} ${styles.blobCyan}`} />
				<span className={`${styles.blob} ${styles.blobGreen}`} />
				<span className={`${styles.blob} ${styles.blobPink}`} />
			</div>

			<form
				action={async (formData) => {
					"use server";
					await sendReset(formData);
				}}
				className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gray-200"
			>
				<div className="text-center space-y-1 mb-2">
					<h1 className="text-2xl font-semibold text-slate-900">Glemt kodeord?</h1>
					<p className="text-sm text-slate-600">Indtast din email. Hvis vi finder den, sender vi et link.</p>
				</div>

				<div className="space-y-4">
					<input
						type="email"
						name="email"
						placeholder="Din email"
						className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
						required
					/>
				</div>

				<button
					type="submit"
					className="w-full rounded-lg bg-sky-500 py-2 font-medium text-white transition hover:bg-sky-600 disabled:opacity-50"
				>Send link</button>

				<p className="text-sm text-center text-gray-600">
					Gå tilbage til {" "}
					<Link href="/login" className="text-sky-600 hover:underline">Log ind</Link>
				</p>
			</form>
		</section>
	);
}

