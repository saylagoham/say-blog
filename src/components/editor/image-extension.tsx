import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer, NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

export const SayImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: "" },
      align: { default: "center" }, // left | center | right | full
      width: { default: 100 }, // percent, 25-100
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

const SIZE_PRESETS = [
  { label: "Small", value: 55 },
  { label: "Medium", value: 78 },
  { label: "Full", value: 100 },
];

function ImageView({ node, updateAttributes, selected, editor }: ReactNodeViewProps) {
  const { src, alt, caption, align, width } = node.attrs;
  const editable = editor.isEditable;

  const alignClass =
    align === "left" ? "mr-auto" : align === "right" ? "ml-auto" : align === "full" ? "w-full" : "mx-auto";

  return (
    <NodeViewWrapper className="my-6">
      <figure
        className={`say-img-figure ${align === "full" ? "w-full" : ""} ${alignClass}`}
        style={{ "--img-w": align === "full" ? "100%" : `${width}%` } as React.CSSProperties}
      >
        <img src={src} alt={alt || ""} className="w-full h-auto rounded-lg" />
        {editable ? (
          <input
            value={caption ?? ""}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder="Caption (optional)"
            className="mt-2 w-full text-sm text-center text-[var(--ink-soft)] bg-transparent border-none outline-none placeholder:text-black/30"
          />
        ) : (
          caption && <figcaption>{caption}</figcaption>
        )}

        {editable && selected && (
          <div
            contentEditable={false}
            className="mt-2 flex items-center justify-center gap-3 bg-white border border-black/10 rounded-lg px-3 py-2 shadow-sm text-xs"
          >
            <div className="flex gap-1">
              {(["left", "center", "right", "full"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateAttributes({ align: a })}
                  className={`px-2 py-1 rounded ${align === a ? "bg-[var(--baby-blue)]" : "hover:bg-black/5"}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {SIZE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  disabled={align === "full"}
                  onClick={() => updateAttributes({ width: p.value })}
                  className={`px-2 py-1 rounded disabled:opacity-40 ${
                    (align === "full" ? 100 : width) === p.value ? "bg-[var(--baby-blue)]" : "hover:bg-black/5"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <input
              value={alt ?? ""}
              onChange={(e) => updateAttributes({ alt: e.target.value })}
              placeholder="alt text"
              className="w-28 border border-black/10 rounded px-1.5 py-0.5"
            />
          </div>
        )}
      </figure>
    </NodeViewWrapper>
  );
}
