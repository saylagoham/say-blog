import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next = "/admin" } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--warm-white)] px-6">
      <form
        action={signIn}
        className="w-full max-w-sm bg-white border border-black/10 rounded-2xl p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold mb-1">Say</h1>
        <p className="text-sm text-black/50 mb-6">Owner login</p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <input type="hidden" name="next" value={next} />

        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full mb-4 rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--baby-blue)]"
        />

        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full mb-6 rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--baby-blue)]"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--ink)] text-white text-sm font-medium py-2.5 hover:opacity-90 transition"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
