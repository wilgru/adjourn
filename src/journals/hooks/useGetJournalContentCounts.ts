import { useQuery } from "@tanstack/react-query";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";

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

      const [
        notesResponse,
        bookmarkedResponse,
        tasksResponse,
        updatesResponse,
      ] = await Promise.all([
        window.api.getNotes({ journalId }),
        window.api.getNotes({ journalId, isBookmarked: true }),
        window.api.getTasks({ journalId }),
        window.api.getUpdates({ journalId }),
      ]);

      if (!notesResponse.success) throw new Error(notesResponse.error);
      if (!bookmarkedResponse.success)
        throw new Error(bookmarkedResponse.error);
      if (!tasksResponse.success) throw new Error(tasksResponse.error);
      if (!updatesResponse.success) throw new Error(updatesResponse.error);

      return {
        noteCount: notesResponse.data.notes.length,
        bookmarkedCount: bookmarkedResponse.data.notes.length,
        taskCount: tasksResponse.data.tasks.length,
        updateCount: updatesResponse.data.updates.length,
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
