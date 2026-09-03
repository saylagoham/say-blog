"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { getExtensions } from "./extensions";

export default function TiptapRenderer({ content }: { content: object }) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: getExtensions(),
    content,
  });

  return <EditorContent editor={editor} />;
}
