import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapTag } from "src/tags/utils/mapTag";
import { createTag } from "../serverFunctions/createTag";
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
  const createTagFn = useServerFn(createTag);

  const mutationFn = async ({
    createTagData,
  }: CreateTagProps): Promise<Tag> => {
    const row = await createTagFn({
      data: {
        name: createTagData.name,
        colour: createTagData.colour.name,
        icon: createTagData.icon,
        description: createTagData.description,
        sortBy: createTagData.sortBy ?? "created",
        sortDirection: createTagData.sortDirection ?? "asc",
        links: JSON.stringify(createTagData.links),
        tagGroupId: createTagData.tagGroupId ?? null,
        journalId: journalId ?? null,
        userId: user?.id ?? null,
      },
    });

    return mapTag(row, { noteCount: 0 });
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
