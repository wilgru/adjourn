import type Quill from "quill";

export const createToggleHandler =
  (getQuill: () => Quill, format: string) => () => {
    const quill = getQuill();
    const selection = quill.getSelection();

    if (!selection) {
      return;
    }

    const selectionFormatting = quill.getFormat(
      selection.index,
      selection.length,
    );

    quill.format(format, selectionFormatting[format] ? false : true);
  };

export const createListHandler =
  (getQuill: () => Quill) => (value: string | false) => {
    const quill = getQuill();
    const selection = quill.getSelection();

    if (!selection) {
      return;
    }

    const selectionFormatting = quill.getFormat(
      selection.index,
      selection.length,
    );

    if (value === false) {
      quill.format("list", false);
      return;
    }

    quill.format("list", selectionFormatting.list === value ? false : value);
  };

export const createLinkHandler = (getQuill: () => Quill) => () => {
  const quill = getQuill();
  const selection = quill.getSelection();

  if (!selection) {
    return;
  }

  const selectionFormatting = quill.getFormat(
    selection.index,
    selection.length,
  );

  if (selectionFormatting.link) {
    quill.format("link", false);
  } else {
    const url = prompt("Enter URL:");

    if (url) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return;
        }
      } catch {
        return;
      }
      quill.format("link", url);
    }
  }
};
