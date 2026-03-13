import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/pocketbase/utils/connection";
import { mapTag } from "src/tags/utils/mapTag";
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

  const mutationFn = async ({
    tagId,
    updateTagData,
  }: UpdateTagProps): Promise<Tag | undefined> => {
    const rawUpdatedTag = await pb.collection("tags").update(
      tagId,
      {
        ...updateTagData,
        colour: updateTagData.colour.name,
      },
      {
        expand: "links",
      },
    );

    return mapTag(rawUpdatedTag);
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
      return currentNotes.map((note) => {
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
