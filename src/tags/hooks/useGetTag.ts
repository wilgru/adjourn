import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mapNote } from "src/notes/utils/mapNote";
import { mapTag } from "src/tags/utils/mapTag";
import { getTag } from "../serverFunctions/getTag";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";
import type { Tag } from "src/tags/Tag.type";

type UseTagResponse = {
  tag: Tag | undefined;
  notes: Note[];
  refetchTag: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      {
        tag: Tag;
        notes: Note[];
      },
      Error
    >
  >;
};

export const useGetTag = (tagId: string): UseTagResponse => {
  const getTagFn = useServerFn(getTag);

  const queryFn = async (): Promise<{
    tag: Tag;
    notes: Note[];
  }> => {
    const result = await getTagFn({ data: { tagId } });

    const tag = mapTag(result.tag, { noteCount: result.noteCount });
    const notes = result.notes.map((n) => mapNote(n));

    return {
      tag,
      notes,
    };
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tags.get", tagId],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    tag: data?.tag,
    notes: data?.notes ?? [],
    refetchTag: refetch,
  };
};
