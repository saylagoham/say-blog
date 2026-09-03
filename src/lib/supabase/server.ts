import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Components / Server Actions / Route Handlers only.
// Carries the visitor's (or logged-in owner's) session via cookies, so
// Postgres RLS policies decide what they can see and write - no service key needed.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component render; middleware refreshes the session instead
          }
        },
      },
    }
  );
}
