import { useEffect, useRef } from "react";
import { cn } from "src/common/utils/cn";
import type Delta from "quill-delta";

type QuillViewerProps = {
  content: Delta;
  smallViewer?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function QuillViewer({
  content,
  smallViewer = false,
  className,
  onClick,
}: QuillViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let isMounted = true;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const initializeViewer = async () => {
      const { default: Quill } = await import("quill");

      if (!isMounted) {
        return;
      }

      const quillEditor = new Quill(editorContainer, {
        readOnly: true,
        formats: [
          "bold",
          "italic",
          "underline",
          "strike",
          "code",
          "list",
          "indent",
          "blockquote",
          "code-block",
          "link",
        ],
      });

      quillEditor.setContents(content);
    };

    void initializeViewer();

    return () => {
      isMounted = false;
      container.innerHTML = "";
    };
  }, [content]);

  return (
    <div
      id={smallViewer ? "quill-viewer-small" : "quill-viewer"}
      ref={containerRef}
      onClick={onClick}
      className={cn("h-fit placeholder-slate-500", className)}
    />
  );
}
