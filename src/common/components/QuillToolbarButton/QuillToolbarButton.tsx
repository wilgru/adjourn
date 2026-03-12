import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { colours } from "src/colours/colours.constant";
import { cn } from "src/common/utils/cn";
import type { Colour } from "src/colours/Colour.type";

type QuillToolbarButtonProps = {
  children: React.ReactNode;
  value: string;
  colour?: Colour;
};

const QUILL_FORMAT_CLASS: Record<string, string> = {
  ordered: "ql-list",
  bullet: "ql-list",
};

export const QuillToolbarButton = ({
  children,
  value,
  colour = colours.orange,
}: QuillToolbarButtonProps) => {
  const quillClass = QUILL_FORMAT_CLASS[value] ?? `ql-${value}`;

  return (
    <ToggleGroup.Item
      className={cn(
        quillClass,
        "rounded-md text-slate-500 px-2 py-1",
        `hover:${colour.backgroundPill}`,
        `hover:${colour.textPill}`,
        `data-[state=on]:${colour.backgroundPill}`,
        `data-[state=on]:${colour.textPill}`,
      )}
      value={value}
    >
      {children}
    </ToggleGroup.Item>
  );
};
