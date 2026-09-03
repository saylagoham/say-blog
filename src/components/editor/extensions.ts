import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import { FontSize } from "./font-size";
import { SayImage } from "./image-extension";
import { Gallery } from "./gallery-extension";

export function getExtensions({ placeholder }: { placeholder?: string } = {}) {
  return [
    StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
    Underline,
    Link.configure({ openOnClick: false, autolink: true }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    FontFamily,
    FontSize,
    SayImage,
    Gallery,
    ...(placeholder ? [Placeholder.configure({ placeholder })] : []),
  ];
}
