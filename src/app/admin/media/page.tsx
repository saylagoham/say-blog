import { createClient } from "@/lib/supabase/server";

export default async function MediaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: files } = user
    ? await supabase.storage.from("images").list(user.id, { limit: 200, sortBy: { column: "created_at", order: "desc" } })
    : { data: [] };

  const items = (files ?? []).map((f) => ({
    name: f.name,
    url: supabase.storage.from("images").getPublicUrl(`${user!.id}/${f.name}`).data.publicUrl,
  }));

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold mb-2">Media</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8">
        Every image you&apos;ve uploaded into a post. Upload new images from inside the post editor.
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--ink-soft)]">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {items.map((item) => (
            <a key={item.name} href={item.url} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden bg-[var(--line)] block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
