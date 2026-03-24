import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapNote } from "src/notes/utils/mapNote";
import { mapUpdate } from "src/updates/utils/mapUpdate";
import { getUpdates } from "../serverFunctions/getUpdates";
import type { Note } from "src/notes/Note.type";
import type { Update } from "src/updates/Update.type";

type UseGetUpdatesResponse = {
  updates: Update[];
};

export const useGetUpdates = ({
  noteId,
}: {
  noteId?: string;
} = {}): UseGetUpdatesResponse => {
  const { journalId } = useCurrentJournalId();
  const getUpdatesFn = useServerFn(getUpdates);

  const queryFn = async (): Promise<Update[]> => {
    if (!journalId) return [];

    const result = await getUpdatesFn({
      data: { journalId, noteId },
    });

    const noteMap = new Map(
      result.notes.map((note) => [note.id, mapNote(note)]),
    );

    return result.updates.map((update) => {
      const notes = update.noteIds
        .map((id) => noteMap.get(id))
        .filter(Boolean) as Note[];
      return mapUpdate(update, { notes });
    });
  };

  const { data } = useQuery({
    queryKey: ["updates.list", journalId, noteId],
    queryFn,
  });

  return { updates: data ?? [] };
};
