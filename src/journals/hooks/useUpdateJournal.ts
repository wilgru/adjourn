import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mapJournal } from "src/journals/utils/mapJournal";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Journal } from "src/journals/Journal.type";

type UpdateJournalProps = {
  journalId: string;
  updateJournalData: Pick<
    Journal,
    | "title"
    | "icon"
    | "colour"
    | "notesSortBy"
    | "notesSortDirection"
    | "notesGroupBy"
    | "bookmarkedSortBy"
    | "bookmarkedSortDirection"
    | "bookmarkedGroupBy"
  >;
};

type UseUpdateJournalResponse = {
  updateJournal: UseMutateAsyncFunction<
    Journal | undefined,
    Error,
    UpdateJournalProps,
    unknown
  >;
  isUpdatingJournal: boolean;
};

export const useUpdateJournal = (): UseUpdateJournalResponse => {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    journalId,
    updateJournalData,
  }: UpdateJournalProps): Promise<Journal | undefined> => {
    const response = await window.api.updateJournal({
      journalId,
      title: updateJournalData.title,
      icon: updateJournalData.icon,
      colour: updateJournalData.colour.name,
      notesSortBy: updateJournalData.notesSortBy ?? "created",
      notesSortDirection: updateJournalData.notesSortDirection ?? "asc",
      notesGroupBy: updateJournalData.notesGroupBy ?? null,
      bookmarkedSortBy: updateJournalData.bookmarkedSortBy ?? "created",
      bookmarkedSortDirection:
        updateJournalData.bookmarkedSortDirection ?? "asc",
      bookmarkedGroupBy: updateJournalData.bookmarkedGroupBy ?? null,
    });
    if (!response.success) throw new Error(response.error);

    return mapJournal(response.data);
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

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["journals.update"],
    mutationFn,
    onSuccess,
  });

  return { updateJournal: mutateAsync, isUpdatingJournal: isPending };
};
