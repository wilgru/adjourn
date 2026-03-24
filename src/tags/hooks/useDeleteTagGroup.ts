import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteTagGroup } from "../serverFunctions/deleteTagGroup";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

type UseDeleteTagGroupResponse = {
  deleteTagGroup: UseMutateAsyncFunction<
    string | undefined,
    Error,
    string,
    unknown
  >;
};

export const useDeleteTagGroup = (): UseDeleteTagGroupResponse => {
  const queryClient = useQueryClient();
  const deleteTagGroupFn = useServerFn(deleteTagGroup);

  const mutationFn = async (
    tagGroupId: string,
  ): Promise<string | undefined> => {
    await deleteTagGroupFn({ data: { tagGroupId } });
    return tagGroupId;
  };

  const onSuccess = (data: string | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tagGroups.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tags.list"],
    });
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["tagGroups.delete"],
    mutationFn,
    onSuccess,
  });

  return { deleteTagGroup: mutateAsync };
};
