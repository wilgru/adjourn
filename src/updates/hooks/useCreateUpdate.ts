import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapUpdate } from "src/updates/utils/mapUpdate";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Update } from "src/updates/Update.type";

type CreateUpdateProps = {
  createUpdateData: Omit<Update, "id" | "created" | "updated">;
};

type UseCreateUpdateResponse = {
  createUpdate: UseMutateAsyncFunction<
    Update | undefined,
    Error,
    CreateUpdateProps,
    unknown
  >;
};

export const useCreateUpdate = (): UseCreateUpdateResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async ({
    createUpdateData,
  }: CreateUpdateProps): Promise<Update | undefined> => {
    const response = await window.api.createUpdate({
      content: createUpdateData.content
        ? JSON.stringify(createUpdateData.content)
        : null,
      tint: createUpdateData.tint,
      noteIds: createUpdateData.notes.map((n) => n.id),
      journalId: journalId ?? null,
      userId: user?.id ?? null,
    });
    if (!response.success) throw new Error(response.error);

    return mapUpdate(response.data, { notes: createUpdateData.notes });
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["updates.list"],
    });
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["updates.create"],
    mutationFn,
    onSuccess,
  });

  return { createUpdate: mutateAsync };
};
