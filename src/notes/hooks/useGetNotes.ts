import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { mapNote } from "src/notes/utils/mapNote";
import { useGetTags } from "src/tags/hooks/useGetTags";
import { useCurrentJournalId } from "../../journals/hooks/useCurrentJournalId";
import type { Note } from "src/notes/Note.type";

type UseGetNotesResponse = {
  notes: Note[];
};

dayjs.extend(utc);

export const useGetNotes = ({
  isBookmarked,
  createdDateString,
}: {
  isBookmarked?: boolean;
  createdDateString?: string;
}): UseGetNotesResponse => {
  const { journalId } = useCurrentJournalId();
  const { tags: allTags } = useGetTags();

  const queryFn = async (): Promise<{
    notes: Note[];
  }> => {
    let createdAfter: string | undefined;
    let createdBefore: string | undefined;

    if (createdDateString) {
      const localCreatedDateMidday = dayjs(createdDateString)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);

      createdAfter = localCreatedDateMidday
        .utc()
        .subtract(12, "hour")
        .toISOString();

      createdBefore = localCreatedDateMidday
        .utc()
        .add(12, "hour")
        .toISOString();
    }

    const response = await window.api.getNotes({
      journalId: journalId ?? "",
      isBookmarked,
      createdAfter,
      createdBefore,
    });

    if (!response.success) throw new Error(response.error);
    const result = response.data;

    const notes = result.notes.map((row) => {
      const tags = allTags.filter((t) => row.tagIds.includes(t.id));
      return mapNote(row, { tags });
    });

    return { notes };
  };

  // TODO: consider time caching for better performance
  const { data } = useQuery({
    queryKey: ["notes.list", journalId, isBookmarked, createdDateString],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    notes: data?.notes ?? [],
  };
};
