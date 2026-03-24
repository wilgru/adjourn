import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapTag } from "src/tags/utils/mapTag";
import { mapTagGroup } from "src/tags/utils/mapTagGroup";
import { getTagGroups } from "../serverFunctions/getTagGroups";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Tag, TagGroup } from "src/tags/Tag.type";

type UseGetTagGroupsResponse = {
  ungroupedTags: Tag[];
  tagGroups: TagGroup[];
  refetchTagGroups: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      {
        ungroupedTags: Tag[];
        tagGroups: TagGroup[];
      },
      Error
    >
  >;
};

export const useGetTagGroups = (): UseGetTagGroupsResponse => {
  const { journalId } = useCurrentJournalId();
  const getTagGroupsFn = useServerFn(getTagGroups);

  const queryFn = async (): Promise<{
    ungroupedTags: Tag[];
    tagGroups: TagGroup[];
  }> => {
    const result = await getTagGroupsFn({
      data: { journalId: journalId ?? "" },
    });

    const mappedTagGroups = result.tagGroups.map(mapTagGroup);
    const mappedTags = result.tags.map((tag) =>
      mapTag(tag, { noteCount: tag.noteCount }),
    );

    const ungroupedTags: Tag[] = [];
    mappedTags.forEach((tag) => {
      if (tag.tagGroupId) {
        const tagGroup = mappedTagGroups.find(
          (group) => group.id === tag.tagGroupId,
        );
        if (tagGroup) {
          tagGroup.tags.push(tag);
        }
      } else {
        ungroupedTags.push(tag);
      }
    });

    return {
      ungroupedTags,
      tagGroups: mappedTagGroups,
    };
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tagGroups.list", journalId],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    ungroupedTags: data?.ungroupedTags ?? [],
    tagGroups: data?.tagGroups ?? [],
    refetchTagGroups: refetch,
  };
};
