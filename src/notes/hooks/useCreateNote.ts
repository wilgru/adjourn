import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "../../journals/hooks/useCurrentJournalId";
import { createNote } from "../serverFunctions/createNote";
import { mapNote } from "../utils/mapNote";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";

type CreateNoteProps = {
  createNoteData: Omit<
    Note,
    "id" | "created" | "updated" | "deleted" | "tasks" | "updateCount"
  >;
};

type UseCreateNoteResponse = {
  createNote: UseMutateAsyncFunction<
    Note | undefined,
    Error,
    CreateNoteProps,
    unknown
  >;
};

export const useCreateNote = (): UseCreateNoteResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const createNoteFn = useServerFn(createNote);

  const mutationFn = async ({
    createNoteData,
  }: CreateNoteProps): Promise<Note | undefined> => {
    const row = await createNoteFn({
      data: {
        title: createNoteData.title,
        content: JSON.stringify(createNoteData.content),
        isBookmarked: createNoteData.isBookmarked,
        tagIds: createNoteData.tags.map((tag) => tag.id),
        journalId: journalId ?? null,
        userId: user?.id ?? null,
      },
    });

    return mapNote(row, { tags: createNoteData.tags });
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
    mutationKey: ["notes.create"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { createNote: mutateAsync };
};
