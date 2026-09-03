# Say

Personal publishing site — Next.js + Supabase + Tiptap. See `.claude/../` conversation
for the full architecture doc; this is just the setup you need to actually run it.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project (any region).
2. Open **SQL Editor** → New query → paste the contents of `supabase/schema.sql` → Run.
   This creates every table, the row-level security policies, the `images` storage
   bucket, and seeds the starter categories + the Seoul → London journey.
3. Open **Authentication → Users → Add user** and create yourself one user (your email
   + a password). That user *is* the admin — there's no separate roles table, no
   sign-up flow, and no one else can log in without you creating them a user here too.
4. Open **Settings → API** and copy the **Project URL** and the **anon public key**.

## 2. Configure the app

```bash
cp .env.local.example .env.local
```

Paste the URL and anon key into `.env.local`.

## 3. Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Log in at `/admin` with the user you created in step 1.3.

## What's real vs. not

Everything is fully wired to Supabase — posts, drafts, publish/unpublish, images,
categories, tags all persist for real, survive restarts and redeploys, and are
editable from `/admin` with no code changes. Nothing is mocked.

Not built yet (by agreement, for V1): newsletter, comments, paid membership, a
real `/work-with-me` page (reserved route only), and site-wide text like the
homepage "Currently" line is a constant in `src/app/(site)/page.tsx` rather than
an admin-editable field — quick for me to change on request, just not a settings
UI yet.

## Deploying

Push this to a GitHub repo and import it on [Vercel](https://vercel.com/new) — set
the same two env vars there. No other config needed.
