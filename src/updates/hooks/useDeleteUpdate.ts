import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/pocketbase/utils/connection";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

type DeleteUpdateProps = {
  updateId: string;
};

type UseDeleteUpdateResponse = {
  deleteUpdate: UseMutateAsyncFunction<
    string | undefined,
    Error,
    DeleteUpdateProps,
    unknown
  >;
};

export const useDeleteUpdate = (): UseDeleteUpdateResponse => {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    updateId,
  }: DeleteUpdateProps): Promise<string | undefined> => {
    await pb.collection("updates").delete(updateId);
    return updateId;
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["updates.list"],
    });
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["updates.delete"],
    mutationFn,
    onSuccess,
  });

  return { deleteUpdate: mutateAsync };
};
