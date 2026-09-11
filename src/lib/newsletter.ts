"use server";

import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult = {
  status: "success" | "duplicate" | "invalid" | "empty" | "error";
};

// Server Action: runs with the same anon-key + RLS setup as the rest of the
// site (src/lib/supabase/server.ts) -- no service_role key involved. The
// "public can subscribe" RLS policy only grants INSERT, so this is the only
// way (besides the Supabase dashboard) to write a row, and duplicates are
// caught via the table's unique(email) constraint rather than a SELECT --
// the client never gets to see any part of the subscriber list.
export async function subscribeToNewsletter(email: string, source: string): Promise<SubscribeResult> {
  const trimmed = (email ?? "").trim();
  if (!trimmed) return { status: "empty" };
  if (!EMAIL_RE.test(trimmed)) return { status: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: trimmed.toLowerCase(), source });

  if (error) {
    if (error.code === "23505") return { status: "duplicate" }; // unique_violation
    return { status: "error" };
  }
  return { status: "success" };
}
