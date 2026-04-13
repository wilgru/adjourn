import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "src/Users/hooks/useUser";
import { mapJournal } from "src/journals/utils/mapJournal";
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

  const mutationFn = async ({
    createJournalData,
  }: CreateJournalProps): Promise<Journal | undefined> => {
    const response = await window.api.createJournal({
      title: createJournalData.title,
      icon: createJournalData.icon,
      colour: createJournalData.colour.name,
      userId: user?.id ?? null,
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
