import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapTagGroup } from "src/tags/utils/mapTagGroup";
import { createTagGroup } from "../serverFunctions/createTagGroup";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { TagGroup } from "src/tags/Tag.type";

type CreateTagGroupProps = {
  createTagGroupData: Omit<
    TagGroup,
    | "id"
    | "tags"
    | "journalId"
    | "groupBy"
    | "user"
    | "noteCount"
    | "created"
    | "updated"
  >;
};

type UseCreateTagGroupResponse = {
  createTagGroup: UseMutateAsyncFunction<
    TagGroup,
    Error,
    CreateTagGroupProps,
    unknown
  >;
};

export const useCreateTagGroup = (): UseCreateTagGroupResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const createTagGroupFn = useServerFn(createTagGroup);

  const mutationFn = async ({
    createTagGroupData,
  }: CreateTagGroupProps): Promise<TagGroup> => {
    const row = await createTagGroupFn({
      data: {
        title: createTagGroupData.title,
        journalId: journalId ?? null,
        userId: user?.id ?? null,
      },
    });

    return mapTagGroup(row);
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["tagGroups.list"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tags.create"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { createTagGroup: mutateAsync };
};
