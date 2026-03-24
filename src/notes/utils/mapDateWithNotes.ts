import dayjs from "dayjs";
import type { DateWithNotes } from "src/notes/Note.type";

type DateWithNotesRow = {
  id: string;
  created: string;
  hasBookmarked: boolean;
};

export const mapDateWithNotes = (
  dateWithNotes: DateWithNotesRow,
): DateWithNotes => {
  return {
    id: dateWithNotes.id,
    created: dayjs(dateWithNotes.created),
    hasBookmarked: dateWithNotes.hasBookmarked,
  };
};
