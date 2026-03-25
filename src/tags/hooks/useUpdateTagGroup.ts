import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mapTagGroup } from "src/tags/utils/mapTagGroup";
import { updateTagGroup } from "../serverFunctions/updateTagGroup";
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
  const updateTagGroupFn = useServerFn(updateTagGroup);

  const mutationFn = async ({
    tagGroupId,
    updateTagGroupData,
  }: UpdateTagGroupProps): Promise<TagGroup | undefined> => {
    const row = await updateTagGroupFn({
      data: {
        tagGroupId,
        title: updateTagGroupData.title,
      },
    });

    return mapTagGroup(row);
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
