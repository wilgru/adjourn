import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { pb } from "src/pocketbase/utils/connection";
import { mapTag } from "src/tags/utils/mapTag";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Tag } from "src/tags/Tag.type";

type CreateTagProps = {
  createTagData: Omit<
    Tag,
    | "id"
    | "journalId"
    | "groupBy"
    | "user"
    | "noteCount"
    | "created"
    | "updated"
  >;
};

type UseCreateTagResponse = {
  createTag: UseMutateAsyncFunction<Tag, Error, CreateTagProps, unknown>;
};

export const useCreateTag = (): UseCreateTagResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async ({
    createTagData,
  }: CreateTagProps): Promise<Tag> => {
    const newTag = await pb.collection("tags").create({
      ...createTagData,
      colour: createTagData.colour.name,
      tagGroup: createTagData.tagGroupId ?? null,
      journal: journalId,
      user: user?.id,
      groupBy: null,
      sortBy: createTagData.sortBy ?? "created",
      sortDirection: createTagData.sortDirection ?? "asc",
    });

    const mappedNewTag = mapTag({ ...newTag, totalNotes: 0 });

    return mappedNewTag;
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["tags.list"],
    });
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

  return { createTag: mutateAsync };
};
