import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mapNote } from "src/notes/utils/mapNote";
import { updateNote } from "../serverFunctions/updateNote";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";

type UpdateNoteProps = {
  noteId: string;
  updateNoteData: Note;
};

type UseUpdateNoteResponse = {
  updateNote: UseMutateAsyncFunction<
    Note | undefined,
    Error,
    UpdateNoteProps,
    unknown
  >;
};

export const useUpdateNote = (): UseUpdateNoteResponse => {
  const queryClient = useQueryClient();
  const updateNoteFn = useServerFn(updateNote);

  const mutationFn = async ({
    noteId,
    updateNoteData,
  }: UpdateNoteProps): Promise<Note | undefined> => {
    const tagIds = updateNoteData.tags.map((tag) => tag.id);

    const row = await updateNoteFn({
      data: {
        noteId,
        title: updateNoteData.title,
        content: JSON.stringify(updateNoteData.content),
        isBookmarked: updateNoteData.isBookmarked,
        tagIds,
      },
    });

    return mapNote(row, {
      tags: updateNoteData.tags,
      tasks: updateNoteData.tasks,
    });
  };

  const onSuccess = (data: Note | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["notes.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tags.get"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["notes.update"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { updateNote: mutateAsync };
};
