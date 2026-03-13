import "./style.css";
import Quill from "quill";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getColourHex } from "src/colours/utils/getColourHex";
import {
  createLinkHandler,
  createListHandler,
  createToggleHandler,
} from "./quillFormatHandlers";
import type { RangeStatic, StringMap } from "quill";
import type Delta from "quill-delta";
import type { Colour } from "src/colours/Colour.type";

type QuillEditorProps = {
  toolbarId: string;
  value?: Delta;
  colour?: Colour;
  onChange: (delta: Delta) => void;
  onSelectedFormattingChange: (selectionFormatting: StringMap) => void;
};

// https://quilljs.com/docs/modules/toolbar/
// https://quilljs.com/docs/api#formatting
// https://medium.com/@mircea.calugaru/react-quill-editor-with-full-toolbar-options-and-custom-buttons-undo-redo-176d79f8d375

// TODO: override quills internal value updating? make this comp more like textarea, pass value and onChange and use onChange to update a state to pass to the value
const QuillEditor = ({
  toolbarId,
  value,
  colour,
  onChange,
  onSelectedFormattingChange,
}: QuillEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const [quillEditor, setQuillEditor] = useState<Quill | null>();

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (!quillEditor) return;
    if (value === undefined) return;

    const current = quillEditor.getContents();
    try {
      if (JSON.stringify(current) !== JSON.stringify(value)) {
        quillEditor.setContents(value, "api");
      }
    } catch {
      quillEditor.setContents(value, "api");
    }
  }, [value, quillEditor]);

  useEffect(() => {
    if (!quillEditor) return;

    const handleTextChange = (
      _delta: Delta,
      _oldDelta: Delta,
      source: string,
    ) => {
      const selection = quillEditor.getSelection();

      if (selection) {
        const selectionFormatting = quillEditor.getFormat(
          selection.index,
          selection.length,
        );

        onSelectedFormattingChange(selectionFormatting);
      }

      // Only notify consumers for user-driven changes (like a textarea)
      if (source === "user") {
        onChangeRef.current?.(quillEditor.getContents());
      }
    };

    const handleSelectionChange = (range: RangeStatic) => {
      if (range) {
        const selectionFormatting = quillEditor.getFormat(
          range.index,
          range.length,
        );

        onSelectedFormattingChange(selectionFormatting);
      }
    };

    quillEditor.on("text-change", handleTextChange);
    quillEditor.on("selection-change", handleSelectionChange);

    return () => {
      quillEditor?.off("text-change", handleTextChange);
      quillEditor?.off("selection-change", handleSelectionChange);
    };
  }, [onSelectedFormattingChange, quillEditor]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const quill: Quill = new Quill(editorContainer, {
      // debug: import.meta.env.DEV ? "info" : undefined, // TODO: add back in with dev tools
      placeholder: "No content",
      modules: {
        toolbar: {
          container: `#${toolbarId}`,
          handlers: {
            bold: createToggleHandler(() => quill, "bold"),
            italic: createToggleHandler(() => quill, "italic"),
            underline: createToggleHandler(() => quill, "underline"),
            strike: createToggleHandler(() => quill, "strike"),
            list: createListHandler(() => quill),
            blockquote: createToggleHandler(() => quill, "blockquote"),
            "code-block": createToggleHandler(() => quill, "code-block"),
            link: createLinkHandler(() => quill),
          },
        },
      },
      formats: [
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "blockquote",
        "code-block",
        "link",
      ],
    });

    setQuillEditor(quill);

    return () => {
      container.innerHTML = "";

      setQuillEditor(null);
    };
  }, [toolbarId]);

  return (
    <div
      id="quill-editor"
      ref={containerRef}
      className="h-fit placeholder-slate-500"
      style={
        colour
          ? ({ "--ql-link-color": getColourHex(colour) } as React.CSSProperties)
          : undefined
      }
    ></div>
  );
};

export { QuillEditor };
