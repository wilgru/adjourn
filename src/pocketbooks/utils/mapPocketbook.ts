import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { getColour } from "src/colours/utils/getColour";
import type { Pocketbook } from "src/pocketbooks/Pocketbook.type";
import type { PocketbookSchema } from "src/pocketbooks/pocketbooks.schema";

dayjs.extend(utc);

export const mapPocketbook = (pocketbook: PocketbookSchema): Pocketbook => {
  return {
    id: pocketbook.id,
    title: pocketbook.title,
    icon: pocketbook.icon,
    colour: getColour(pocketbook.colour),
    created: dayjs.utc(pocketbook.created).local(),
    updated: dayjs.utc(pocketbook.updated).local(),
    notesSortBy:
      (pocketbook.notesSortBy as "alphabetical" | "created") ?? "created",
    notesSortDirection: (pocketbook.notesSortDirection as "asc" | "desc") ?? "asc",
    notesGroupBy: (pocketbook.notesGroupBy as "created" | "tag" | null) ?? null,
    bookmarkedSortBy:
      (pocketbook.bookmarkedSortBy as "alphabetical" | "created") ?? "created",
    bookmarkedSortDirection:
      (pocketbook.bookmarkedSortDirection as "asc" | "desc") ?? "asc",
    bookmarkedGroupBy:
      (pocketbook.bookmarkedGroupBy as "created" | "tag" | null) ?? null,
  };
};
