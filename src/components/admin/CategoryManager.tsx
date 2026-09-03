"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertCategory, deleteCategory } from "@/app/admin/actions";
import type { Category } from "@/lib/types";

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");

  function refresh() {
    startTransition(() => router.refresh());
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold mb-2">Categories</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8">
        Rename, reorder, or remove any time — every post using a category updates automatically.
      </p>

      <div className="rounded-xl border border-black/10 bg-white divide-y divide-black/5 mb-6">
        {categories.map((c) => (
          <CategoryRow key={c.id} category={c} onSaved={refresh} onDeleted={refresh} />
        ))}
        {categories.length === 0 && <p className="px-5 py-6 text-sm text-[var(--ink-soft)]">No categories yet.</p>}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newName.trim()) return;
          await upsertCategory({ name: newName.trim() });
          setNewName("");
          refresh();
        }}
        className="flex gap-2"
      >
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm"
        />
        <button disabled={pending} type="submit" className="px-4 py-2 rounded-lg bg-[var(--ink)] text-white text-sm font-medium hover:opacity-90">
          Add
        </button>
      </form>
    </div>
  );
}

function CategoryRow({
  category,
  onSaved,
  onDeleted,
}: {
  category: Category;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [editing, setEditing] = useState(false);

  async function save() {
    await upsertCategory({ id: category.id, name, description });
    setEditing(false);
    onSaved();
  }

  return (
    <div className="px-5 py-3">
      {editing ? (
        <div className="flex flex-col gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-black/15 px-3 py-1.5 text-sm font-medium" />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="rounded-lg border border-black/15 px-3 py-1.5 text-sm"
          />
          <div className="flex gap-3 text-sm">
            <button onClick={save} className="text-[var(--blue-ink)] hover:underline">Save</button>
            <button onClick={() => setEditing(false)} className="text-[var(--ink-soft)] hover:underline">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{category.name}</p>
            <p className="text-xs text-[var(--ink-soft)]">/{category.slug}</p>
          </div>
          <div className="flex gap-3 text-sm">
            <button onClick={() => setEditing(true)} className="text-[var(--blue-ink)] hover:underline">Edit</button>
            <button
              onClick={async () => {
                if (confirm(`Delete "${category.name}"? Posts using it will show no category.`)) {
                  await deleteCategory(category.id);
                  onDeleted();
                }
              }}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
