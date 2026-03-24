import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useGetTags } from "src/tags/hooks/useGetTags";
import { deleteNote } from "../serverFunctions/deleteNote";
import { useGetNotes } from "./useGetNotes";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

type deleteNoteProps = {
  noteId: string;
};

type UseDeleteNoteResponse = {
  deleteNote: UseMutateAsyncFunction<
    string | undefined,
    Error,
    deleteNoteProps,
    unknown
  >;
};

export const useDeleteNote = (): UseDeleteNoteResponse => {
  const queryClient = useQueryClient();
  const { notes } = useGetNotes({ isBookmarked: false });
  const { refetchTags } = useGetTags();
  const deleteNoteFn = useServerFn(deleteNote);

  const mutationFn = async ({
    noteId,
  }: deleteNoteProps): Promise<string | undefined> => {
    const noteToDelete = notes.find((note) => note.id === noteId);

    if (!noteToDelete) {
      return;
    }

    await deleteNoteFn({ data: { noteId } });

    if (noteToDelete.tags.length) {
      await refetchTags();
    }

    return noteId;
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["notes.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tags.get"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["notes.delete"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { deleteNote: mutateAsync };
};
