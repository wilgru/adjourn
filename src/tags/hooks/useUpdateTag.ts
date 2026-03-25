import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mapTag } from "src/tags/utils/mapTag";
import { updateTag } from "../serverFunctions/updateTag";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";
import type { Tag } from "src/tags/Tag.type";

type UpdateTagProps = {
  tagId: string;
  updateTagData: Tag;
};

type UseUpdateTagResponse = {
  updateTag: UseMutateAsyncFunction<
    Tag | undefined,
    Error,
    UpdateTagProps,
    unknown
  >;
};

export const useUpdateTag = (): UseUpdateTagResponse => {
  const queryClient = useQueryClient();
  const updateTagFn = useServerFn(updateTag);

  const mutationFn = async ({
    tagId,
    updateTagData,
  }: UpdateTagProps): Promise<Tag | undefined> => {
    const row = await updateTagFn({
      data: {
        tagId,
        name: updateTagData.name,
        colour: updateTagData.colour.name,
        icon: updateTagData.icon,
        description: updateTagData.description,
        groupBy: updateTagData.groupBy,
        sortBy: updateTagData.sortBy,
        sortDirection: updateTagData.sortDirection,
        links: JSON.stringify(updateTagData.links),
        tagGroupId: updateTagData.tagGroupId ?? null,
      },
    });

    return mapTag(row, { noteCount: updateTagData.noteCount });
  };

  const onSuccess = (data: Tag | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tags.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tags.get"],
    });

    queryClient.refetchQueries({
      queryKey: ["tagGroups.list"],
    });

    // update tag in any notes that have it
    queryClient.setQueryData(["notes.list"], (currentNotes: Note[]) => {
      return currentNotes?.map((note) => {
        return note.tags.map((tag) => {
          if (tag.id === data.id) {
            return data;
          }

          return tag;
        });
      });
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tags.update"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { updateTag: mutateAsync };
};
