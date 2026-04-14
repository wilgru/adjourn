import { useQuery } from "@tanstack/react-query";
import { useCurrentPocketbookId } from "src/pocketbooks/hooks/useCurrentPocketbookId";
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
  const { pocketbookId } = useCurrentPocketbookId();

  const queryFn = async (): Promise<Update[]> => {
    if (!pocketbookId) return [];

    const [updatesResponse, notesResponse] = await Promise.all([
      window.api.getUpdates({ pocketbookId }),
      window.api.getNotes({ pocketbookId }),
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
    queryKey: ["updates.list", pocketbookId, noteId],
    queryFn,
  });

  return { updates: data ?? [] };
};
