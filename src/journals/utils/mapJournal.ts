import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { getColour } from "src/colours/utils/getColour";
import type { Journal } from "src/journals/Journal.type";
import type { JournalSchema } from "src/journals/journals.schema";

dayjs.extend(utc);

export const mapJournal = (
  journal: JournalSchema & { noteCount?: number; taskCount?: number },
): Journal => {
  return {
    id: journal.id,
    title: journal.title,
    icon: journal.icon,
    colour: getColour(journal.colour),
    created: dayjs.utc(journal.created).local(),
    updated: dayjs.utc(journal.updated).local(),
    notesSortBy:
      (journal.notesSortBy as "alphabetical" | "created") ?? "created",
    notesSortDirection: (journal.notesSortDirection as "asc" | "desc") ?? "asc",
    notesGroupBy: (journal.notesGroupBy as "created" | "tag" | null) ?? null,
    bookmarkedSortBy:
      (journal.bookmarkedSortBy as "alphabetical" | "created") ?? "created",
    bookmarkedSortDirection:
      (journal.bookmarkedSortDirection as "asc" | "desc") ?? "asc",
    bookmarkedGroupBy:
      (journal.bookmarkedGroupBy as "created" | "tag" | null) ?? null,
    noteCount: journal.noteCount,
    taskCount: journal.taskCount,
  };
};
