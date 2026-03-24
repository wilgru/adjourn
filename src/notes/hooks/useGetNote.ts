import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mapNote } from "src/notes/utils/mapNote";
import { useGetTags } from "src/tags/hooks/useGetTags";
import { useGetTasks } from "src/tasks/hooks/useGetTasks";
import { getNote } from "../serverFunctions/getNote";
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
  const getNoteFn = useServerFn(getNote);

  const queryFn = async (): Promise<Note> => {
    const result = await getNoteFn({ data: { noteId: noteId ?? "" } });
    const tags = allTags.filter((tag) => result.tagIds.includes(tag.id));
    const tasks = allTasks.filter((task) => task.note?.id === result.note.id);
    return mapNote(result.note, { tags, tasks });
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
