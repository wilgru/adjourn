import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useUser } from "src/Users/hooks/useUser";
import { mapJournal } from "src/journals/utils/mapJournal";
import { createJournal } from "../serverFunctions/createJournal";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Journal } from "src/journals/Journal.type";

type CreateJournalProps = {
  createJournalData: Omit<Journal, "id" | "created" | "updated">;
};

type UseCreateJournalResponse = {
  createJournal: UseMutateAsyncFunction<
    Journal | undefined,
    Error,
    CreateJournalProps,
    unknown
  >;
  isCreatingJournal: boolean;
};

export const useCreateJournal = (): UseCreateJournalResponse => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const createJournalFn = useServerFn(createJournal);

  const mutationFn = async ({
    createJournalData,
  }: CreateJournalProps): Promise<Journal | undefined> => {
    const row = await createJournalFn({
      data: {
        title: createJournalData.title,
        icon: createJournalData.icon,
        colour: createJournalData.colour.name,
        notesSortBy: createJournalData.notesSortBy ?? "created",
        notesSortDirection: createJournalData.notesSortDirection ?? "asc",
        notesGroupBy: createJournalData.notesGroupBy ?? null,
        bookmarkedSortBy: createJournalData.bookmarkedSortBy ?? "created",
        bookmarkedSortDirection:
          createJournalData.bookmarkedSortDirection ?? "asc",
        bookmarkedGroupBy: createJournalData.bookmarkedGroupBy ?? null,
        userId: user?.id ?? null,
      },
    });

    return mapJournal(row);
  };

  const onSuccess = (data: Journal | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["journals.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["journals.get"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["journals.create"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { createJournal: mutateAsync, isCreatingJournal: isPending };
};
