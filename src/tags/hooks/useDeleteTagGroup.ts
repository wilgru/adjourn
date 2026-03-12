import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/pocketbase/utils/connection";
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

  const mutationFn = async (
    tagGroupId: string,
  ): Promise<string | undefined> => {
    const tagsInGroup = await pb.collection("tags").getFullList({
      filter: `tagGroup = '${tagGroupId}'`,
    });

    await Promise.all(
      tagsInGroup.map((tag) =>
        pb.collection("tags").update(tag.id, { tagGroup: null }),
      ),
    );

    const isTagGroupDeleted = await pb.collection("tagGroups").delete(tagGroupId);

    if (isTagGroupDeleted) {
      return tagGroupId;
    }

    return undefined;
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
