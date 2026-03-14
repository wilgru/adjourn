import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/pocketbase/utils/connection";
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
    const rawUpdatedUpdate = await pb.collection("updates").update(
      updateId,
      {
        content: updateData.content,
        tint: updateData.tint,
        notes: updateData.notes?.map((n) => n.id),
      },
      { expand: "notes" },
    );

    return mapUpdate(rawUpdatedUpdate);
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
