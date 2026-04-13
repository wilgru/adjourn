import { useQuery } from "@tanstack/react-query";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapDateWithNotes } from "src/notes/utils/mapDateWithNotes";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { DateWithNotes } from "src/notes/Note.type";

type UseGetDatesWithUpdatesResponse = {
  datesWithUpdates: DateWithNotes[];
  refetchDatesWithUpdates: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<DateWithNotes[], Error>>;
};

export const useGetDatesWithUpdates = (): UseGetDatesWithUpdatesResponse => {
  const { journalId: routeJournalId } = useCurrentJournalId();
  const journalId = routeJournalId;

  const queryFn = async (): Promise<DateWithNotes[]> => {
    if (!journalId) {
      return [];
    }

    const response = await window.api.getUpdates({ journalId });
    if (!response.success) throw new Error(response.error);

    const uniqueDates = new Map<string, string>();
    for (const update of response.data.updates) {
      const dateStr = update.created.split("T")[0];
      if (!uniqueDates.has(dateStr)) {
        uniqueDates.set(dateStr, update.created);
      }
    }

    const dates = Array.from(uniqueDates.entries()).map(([id, created]) => ({
      id,
      created,
      hasBookmarked: false,
    }));

    return dates.map(mapDateWithNotes);
  };

  const { data, refetch } = useQuery({
    queryKey: ["datesWithUpdates.list", journalId],
    queryFn,
    enabled: Boolean(journalId),
  });

  return { datesWithUpdates: data ?? [], refetchDatesWithUpdates: refetch };
};
