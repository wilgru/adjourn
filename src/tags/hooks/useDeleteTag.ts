import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteTag } from "../serverFunctions/deleteTag";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

type UseDeleteTagResponse = {
  deleteTag: UseMutateAsyncFunction<string | undefined, Error, string, unknown>;
};

export const useDeleteTag = (): UseDeleteTagResponse => {
  const queryClient = useQueryClient();
  const deleteTagFn = useServerFn(deleteTag);

  const mutationFn = async (tagId: string): Promise<string | undefined> => {
    await deleteTagFn({ data: { tagId } });
    return tagId;
  };

  const onSuccess = (data: string | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tags.list"],
    });

    // remove tag from any notes
    queryClient.refetchQueries({
      queryKey: ["notes.list"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tags.delete"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { deleteTag: mutateAsync };
};
