import { useQuery } from "@tanstack/react-query";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { pb } from "src/pocketbase/utils/connection";

type JournalContentCounts = {
  noteCount: number;
  bookmarkedCount: number;
  taskCount: number;
  updateCount: number;
};

type UseGetJournalContentCountsResponse = {
  counts: JournalContentCounts | undefined;
  isFetching: boolean;
};

export const useGetJournalContentCounts =
  (): UseGetJournalContentCountsResponse => {
    const { journalId } = useCurrentJournalId();

    const queryFn = async (): Promise<JournalContentCounts> => {
      if (!journalId) {
        return {
          noteCount: 0,
          bookmarkedCount: 0,
          taskCount: 0,
          updateCount: 0,
        };
      }

      const result = await pb
        .collection("journalContentCounts")
        .getFirstListItem(`journal = "${journalId}"`);

      return {
        noteCount: result.noteCount ?? 0,
        bookmarkedCount: result.bookmarkedCount ?? 0,
        taskCount: result.taskCount ?? 0,
        updateCount: result.updateCount ?? 0,
      };
    };

    const { data, isFetching } = useQuery({
      queryKey: ["journalContentCounts", journalId],
      queryFn,
      enabled: !!journalId,
    });

    return {
      counts: data,
      isFetching,
    };
  };
