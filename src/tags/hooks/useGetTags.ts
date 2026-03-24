import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapTag } from "src/tags/utils/mapTag";
import { getTags } from "../serverFunctions/getTags";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Tag } from "src/tags/Tag.type";

type UseGetTagsResponse = {
  tags: Tag[];
  refetchTags: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<Tag[], Error>>;
};

export const useGetTags = (): UseGetTagsResponse => {
  const { journalId } = useCurrentJournalId();
  const getTagsFn = useServerFn(getTags);

  const queryFn = async (): Promise<Tag[]> => {
    const result = await getTagsFn({
      data: { journalId: journalId ?? "" },
    });

    return result.tags.map((tag) => mapTag(tag, { noteCount: tag.noteCount }));
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tags.list", journalId],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { tags: data ?? [], refetchTags: refetch };
};
