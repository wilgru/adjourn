import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    const response = await window.api.deleteUpdate({ updateId });
    if (!response.success) throw new Error(response.error);
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
