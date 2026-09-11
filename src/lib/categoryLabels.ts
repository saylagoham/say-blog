// Bilingual display labels for the site's 5 curated categories.
// Keyed by the DB `categories.slug` (the actual filter value) — never the
// label text — so relabeling here never touches stored posts/categories.
export const CATEGORY_LABELS: Record<string, { ko: string; en: string }> = {
  london: { ko: "영국살이", en: "UK" },
  life: { ko: "일상", en: "Daily" },
  travel: { ko: "여행", en: "Travel" },
  english: { ko: "영어공부", en: "English" },
  money: { ko: "돈 이야기", en: "Money" },
};

// Soft pastel background for the default post thumbnail (no cover image),
// tuned to sit alongside the site's cream / baby-blue / pink palette.
export const CATEGORY_THUMB_BG: Record<string, string> = {
  london: "#fbe4ea", // soft pink
  life: "#f3ead9", // warm beige
  travel: "var(--blue-tint)", // baby blue
  english: "#ece7f6", // soft lavender
  money: "#e3f3ea", // soft mint
};
