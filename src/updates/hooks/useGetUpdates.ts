import { useQuery } from "@tanstack/react-query";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapNote } from "src/notes/utils/mapNote";
import { mapUpdate } from "src/updates/utils/mapUpdate";
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

  const queryFn = async (): Promise<Update[]> => {
    if (!journalId) return [];

    const [updatesResponse, notesResponse] = await Promise.all([
      window.api.getUpdates({ journalId }),
      window.api.getNotes({ journalId }),
    ]);

    if (!updatesResponse.success) throw new Error(updatesResponse.error);
    if (!notesResponse.success) throw new Error(notesResponse.error);

    const filteredUpdates = noteId
      ? updatesResponse.data.updates.filter((update) =>
          update.noteIds.includes(noteId),
        )
      : updatesResponse.data.updates;

    const noteMap = new Map(
      notesResponse.data.notes.map((note) => [note.id, mapNote(note)]),
    );

    return filteredUpdates.map((update) => {
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
