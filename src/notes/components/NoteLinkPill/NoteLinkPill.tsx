import { colours } from "src/colours/colours.constant";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import type { Colour } from "src/colours/Colour.type";
import type { NoteLink } from "src/notes/Note.type";

type NoteLinkPillProps = {
  link: NoteLink;
  colour?: Colour;
};

export const NoteLinkPill = ({
  link,
  colour = colours.orange,
}: NoteLinkPillProps) => {
  const handleClick = () => {
    window.open(link.link, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "h-fit w-fit flex items-center gap-2 rounded-full transition-colors",
        "text-xs font-normal py-1 pl-1 pr-2",
        colour.textPill,
        colour.backgroundPill,
        colour.textPillInverted,
        colour.backgroundPillInverted,
      )}
    >
      <Icon iconName="link" size="sm" weight="regular" />
      <span className="inline-block overflow-hidden max-w-[10rem]">
        {link.title || link.link}
      </span>
    </button>
  );
};
