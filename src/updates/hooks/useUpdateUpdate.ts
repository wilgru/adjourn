import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mapUpdate } from "src/updates/utils/mapUpdate";
import { updateUpdate } from "../serverFunctions/updateUpdate";
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
  const updateUpdateFn = useServerFn(updateUpdate);

  const mutationFn = async ({
    updateId,
    updateData,
  }: UpdateUpdateProps): Promise<Update | undefined> => {
    const row = await updateUpdateFn({
      data: {
        updateId,
        content: updateData.content ? JSON.stringify(updateData.content) : null,
        tint: updateData.tint ?? null,
        noteIds: updateData.notes?.map((n) => n.id) ?? [],
      },
    });

    return mapUpdate(row, { notes: updateData.notes ?? [] });
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
