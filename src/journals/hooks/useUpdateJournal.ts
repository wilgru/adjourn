import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mapJournal } from "src/journals/utils/mapJournal";
import { pb } from "src/pocketbase/utils/connection";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Journal } from "src/journals/Journal.type";

type UpdateJournalProps = {
  journalId: string;
  updateJournalData: Pick<Journal, "title" | "icon" | "colour">;
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
    const rawUpdatedJournal = await pb.collection("journals").update(journalId, {
      ...updateJournalData,
      colour: updateJournalData.colour.name,
    });

    return mapJournal(rawUpdatedJournal);
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
