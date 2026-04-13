import { useQuery } from "@tanstack/react-query";
import { mapNote } from "src/notes/utils/mapNote";
import { useGetTags } from "src/tags/hooks/useGetTags";
import { useGetTasks } from "src/tasks/hooks/useGetTasks";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";

type UseGetNoteResponse = {
  note: Note | undefined;
  refetchNote: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<Note, Error>>;
};

export const useGetNote = ({
  noteId,
}: {
  noteId: string | null;
}): UseGetNoteResponse => {
  const { tags: allTags } = useGetTags();
  const { tasks: allTasks } = useGetTasks({});

  const queryFn = async (): Promise<Note> => {
    const response = await window.api.getNote({ noteId: noteId ?? "" });
    if (!response.success) throw new Error(response.error);

    const noteRow = response.data;

    const tags = allTags.filter((tag) => noteRow.tagIds.includes(tag.id));
    const tasks = allTasks.filter((task) => task.note?.id === noteRow.note.id);

    return mapNote(noteRow.note, { tags, tasks });
  };

  const { data, refetch } = useQuery({
    queryKey: ["notes.get", noteId],
    queryFn,
    enabled: !!noteId,
  });

  return {
    note: data,
    refetchNote: refetch,
  };
};
