import type { JournalSchema } from "./journals.schema";
import type { Dayjs } from "dayjs";
import type { Colour } from "src/colours/Colour.type";
import type { Prettify } from "src/common/types/Prettify.type";

export type Journal = Prettify<Omit<
  JournalSchema,
  | "colour"
  | "notesSortBy"
  | "notesSortDirection"
  | "notesGroupBy"
  | "bookmarkedSortBy"
  | "bookmarkedSortDirection"
  | "bookmarkedGroupBy"
  | "user"
  | "created"
  | "updated"
> & {
  colour: Colour;
  created: Dayjs;
  updated: Dayjs;
  noteCount?: number;
  taskCount?: number;
  notesSortBy?: "alphabetical" | "created";
  notesSortDirection?: "asc" | "desc";
  notesGroupBy?: "created" | "tag" | null;
  bookmarkedSortBy?: "alphabetical" | "created";
  bookmarkedSortDirection?: "asc" | "desc";
  bookmarkedGroupBy?: "created" | "tag" | null;
}>;
