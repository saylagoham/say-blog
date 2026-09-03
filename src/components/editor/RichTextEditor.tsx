"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { useEffect, useReducer, useRef } from "react";
import { getExtensions } from "./extensions";

const FONT_SIZES = ["14px", "16px", "18px", "20px", "24px", "28px", "34px"];
const FONT_FAMILIES = [
  { label: "Pretendard", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
];

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: object;
  onChange: (json: object) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: getExtensions({ placeholder: "이야기를 시작해보세요…" }),
    content,
    editorProps: {
      attributes: { class: "prose-say min-h-[400px] focus:outline-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  });

  if (!editor) return null;

  return (
    <div className="border border-black/10 rounded-xl bg-white">
      <Toolbar editor={editor} />
      <div className="px-6 py-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const imageInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  // re-render toolbar on selection change so active states stay correct
  useEditorUpdate(editor);

  async function onImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await uploadFile(file);
    editor.chain().focus().setImage({ src: url, alt: "" }).run();
  }

  async function onGalleryPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length < 2) return;
    const urls = await Promise.all(files.map(uploadFile));
    editor
      .chain()
      .focus()
      .insertContent({ type: "gallery", attrs: { images: urls.map((src) => ({ src, alt: "" })) } })
      .run();
  }

  function setLink() {
    const url = window.prompt("URL");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  }

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded-md text-sm hover:bg-black/5 ${active ? "bg-[var(--blue-tint)] text-[var(--blue-ink)]" : ""}`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-black/10 px-3 py-2">
      <select
        value={editor.isActive("heading", { level: 1 }) ? "1" : editor.isActive("heading", { level: 2 }) ? "2" : editor.isActive("heading", { level: 3 }) ? "3" : "p"}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: Number(v) as 1 | 2 | 3 }).run();
        }}
        className="text-sm border border-black/10 rounded-md px-1.5 py-1 mr-1"
      >
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      <select
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="text-sm border border-black/10 rounded-md px-1.5 py-1 mr-1"
        defaultValue=""
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>{f.label}</option>
        ))}
      </select>

      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        className="text-sm border border-black/10 rounded-md px-1.5 py-1 mr-2"
        defaultValue=""
      >
        <option value="" disabled>Size</option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
      <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
      <button type="button" className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
      <button type="button" className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>

      <input
        type="color"
        title="Text color"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="w-7 h-7 rounded cursor-pointer border border-black/10 mx-0.5"
      />
      <input
        type="color"
        title="Highlight"
        defaultValue="#fff4bb"
        onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
        className="w-7 h-7 rounded cursor-pointer border border-black/10 mr-1"
      />

      <button type="button" className={btn(editor.isActive("link"))} onClick={setLink}>Link</button>

      <span className="w-px h-5 bg-black/10 mx-1" />

      <button type="button" className={btn(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()}>⟸</button>
      <button type="button" className={btn(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()}>≡</button>
      <button type="button" className={btn(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()}>⟹</button>

      <span className="w-px h-5 bg-black/10 mx-1" />

      <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</button>

      <span className="w-px h-5 bg-black/10 mx-1" />

      <button type="button" className={btn(false)} onClick={() => imageInput.current?.click()}>+ Image</button>
      <button type="button" className={btn(false)} onClick={() => galleryInput.current?.click()}>+ Gallery</button>
      <input ref={imageInput} type="file" accept="image/*" hidden onChange={onImagePick} />
      <input ref={galleryInput} type="file" accept="image/*" hidden multiple onChange={onGalleryPick} />
    </div>
  );
}

// Tiptap's toolbar active-state (bold/italic/etc.) only updates on editor
// transactions, not React state -- force a re-render on selection/content change.
function useEditorUpdate(editor: Editor) {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  useEffect(() => {
    editor.on("transaction", forceRender);
    return () => {
      editor.off("transaction", forceRender);
    };
  }, [editor, forceRender]);
}
