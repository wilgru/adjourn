import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mapUpdate } from "src/updates/utils/mapUpdate";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Update } from "src/updates/Update.type";

type UpdateUpdateProps = {
  updateId: string;
  updateData: Partial<Omit<Update, "id" | "created" | "updated">>;
};

type UseUpdateUpdateResponse = {
  updateUpdate: UseMutateAsyncFunction<
    Update | undefined,
    Error,
    UpdateUpdateProps,
    unknown
  >;
};

export const useUpdateUpdate = (): UseUpdateUpdateResponse => {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    updateId,
    updateData,
  }: UpdateUpdateProps): Promise<Update | undefined> => {
    const response = await window.api.updateUpdate({
      updateId,
      content: updateData.content ? JSON.stringify(updateData.content) : null,
      tint: updateData.tint ?? null,
      noteIds: updateData.notes?.map((n) => n.id) ?? [],
    });
    if (!response.success) throw new Error(response.error);

    return mapUpdate(response.data, { notes: updateData.notes ?? [] });
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["updates.list"],
    });
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["updates.update"],
    mutationFn,
    onSuccess,
  });

  return { updateUpdate: mutateAsync };
};
