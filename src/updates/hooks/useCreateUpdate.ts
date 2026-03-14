import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { pb } from "src/pocketbase/utils/connection";
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
    const createdUpdate = await pb.collection("updates").create(
      {
        content: createUpdateData.content,
        tint: createUpdateData.tint,
        notes: createUpdateData.notes.map((n) => n.id),
        journal: journalId,
        user: user?.id,
      },
      { expand: "notes" },
    );

    return mapUpdate(createdUpdate);
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
