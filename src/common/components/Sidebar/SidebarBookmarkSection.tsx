import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { colours } from "src/colours/colours.constant";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import { useCurrentPocketbookId } from "src/pocketbooks/hooks/useCurrentPocketbookId";
import { useGetNotes } from "src/notes/hooks/useGetNotes";

export const SidebarBookmarkSection = () => {
  const { pocketbookId } = useCurrentPocketbookId();
  const { notes } = useGetNotes({ isBookmarked: true });

  if (!pocketbookId || notes.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-1">
      <div>
        <div className="flex flex-row items-center gap-1">
          <h1 className="font-title text-slate-400 text-md">Bookmarks</h1>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          {notes.map((note) => (
            <BookmarkNavItem
              key={note.id}
              title={note.title ?? "Untitled"}
              pocketbookId={pocketbookId}
              noteId={note.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const BookmarkNavItem = ({
  title,
  pocketbookId,
  noteId,
}: {
  title: string;
  pocketbookId: string;
  noteId: string;
}) => {
  const colour = colours.red;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/$pocketbookId/bookmarked`}
      params={{ pocketbookId }}
      search={{ noteId }}
      activeOptions={{ exact: true, includeSearch: true }}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      activeProps={{
        className: cn(colour.textPill, colour.backgroundPill),
      }}
      className={cn(
        "flex justify-between items-center gap-2 px-2 py-1 rounded-full text-sm transition-colors",
        isHovered && colour.textPill,
        isHovered && colour.backgroundPill,
      )}
    >
      {({ isActive }: { isActive: boolean }) => (
        <div
          className={cn(
            "flex items-center gap-2",
            (isHovered || isActive) && colour.textPill,
          )}
        >
          <Icon
            iconName="bookmark"
            className={colour.textPill}
            size="sm"
            weight={isHovered || isActive ? "fill" : "regular"}
          />
          <p className="truncate">{title === "" ? "Untitled Note" : title}</p>
        </div>
      )}
    </Link>
  );
};
