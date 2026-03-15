import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/pocketbase/utils/connection";
import { mapTagGroup } from "src/tags/utils/mapTagGroup";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { TagGroup } from "src/tags/Tag.type";

type UpdateTagGroupProps = {
  tagGroupId: string;
  updateTagGroupData: Pick<TagGroup, "title">;
};

type UseUpdateTagGroupResponse = {
  updateTagGroup: UseMutateAsyncFunction<
    TagGroup | undefined,
    Error,
    UpdateTagGroupProps,
    unknown
  >;
};

export const useUpdateTagGroup = (): UseUpdateTagGroupResponse => {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    tagGroupId,
    updateTagGroupData,
  }: UpdateTagGroupProps): Promise<TagGroup | undefined> => {
    const rawUpdatedTagGroup = await pb
      .collection("tagGroups")
      .update(tagGroupId, updateTagGroupData);

    return mapTagGroup(rawUpdatedTagGroup);
  };

  const onSuccess = (data: TagGroup | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tagGroups.list"],
    });
  };

  const { mutateAsync } = useMutation({
    mutationKey: ["tagGroups.update"],
    mutationFn,
    onSuccess,
  });

  return { updateTagGroup: mutateAsync };
};
