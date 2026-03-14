import type { Dayjs } from "dayjs";
import type { Colour } from "src/colours/Colour.type";

export type Journal = {
  id: string;
  title: string;
  icon: string;
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
};
