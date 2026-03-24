import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteUpdate } from "../serverFunctions/deleteUpdate";
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
  const deleteUpdateFn = useServerFn(deleteUpdate);

  const mutationFn = async ({
    updateId,
  }: DeleteUpdateProps): Promise<string | undefined> => {
    await deleteUpdateFn({ data: { updateId } });
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
