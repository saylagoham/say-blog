import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

// A row of 2-4 images -- the "gallery block" simplification agreed for V1
// instead of a freeform layout builder.
export const Gallery = Node.create({
  name: "gallery",
  group: "block",
  atom: true,
  addAttributes() {
    return { images: { default: [] as { src: string; alt?: string }[] } };
  },
  parseHTML() {
    return [{ tag: "div[data-gallery]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-gallery": "true" })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(GalleryView);
  },
});

function GalleryView({ node, updateAttributes, editor }: ReactNodeViewProps) {
  const images = (node.attrs.images ?? []) as { src: string; alt?: string }[];
  const editable = editor.isEditable;

  function remove(i: number) {
    updateAttributes({ images: images.filter((_, idx) => idx !== i) });
  }

  return (
    <NodeViewWrapper className="my-6">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 4) || 1}, 1fr)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-[var(--line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt || ""} className="w-full h-full object-cover" />
            {editable && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
}
