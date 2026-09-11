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
