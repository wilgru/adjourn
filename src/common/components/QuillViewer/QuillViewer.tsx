import "./style.css";
import Quill from "quill";
import { useEffect, useRef } from "react";
import { cn } from "src/common/utils/cn";
import type Delta from "quill-delta";

type QuillViewerProps = {
  content: Delta;
  className?: string;
  textColor?: string;
};

export default function QuillViewer({
  content,
  className,
  textColor,
}: QuillViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const quillEditor = new Quill(editorContainer, {
      readOnly: true,
    });

    quillEditor?.setContents(content);

    // Directly apply tint color to the .ql-editor element so it overrides
    // any color that Quill or its container may set via CSS.
    if (textColor) {
      const editorEl = editorContainer.querySelector(
        ".ql-editor",
      ) as HTMLElement | null;
      if (editorEl) {
        editorEl.style.color = textColor;
      }
    }

    return () => {
      container.innerHTML = "";
    };
  }, [content, textColor]);

  return (
    <div
      id="quill-editor"
      ref={containerRef}
      className={cn("h-fit placeholder-slate-500", className)}
    />
  );
}
