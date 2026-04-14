import { useQuery } from "@tanstack/react-query";
import { useCurrentPocketbookId } from "src/pocketbooks/hooks/useCurrentPocketbookId";
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
  const { pocketbookId: routePocketbookId } = useCurrentPocketbookId();
  const pocketbookId = routePocketbookId;

  const queryFn = async (): Promise<DateWithNotes[]> => {
    if (!pocketbookId) {
      return [];
    }

    const response = await window.api.getUpdates({ pocketbookId });
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
    queryKey: ["datesWithUpdates.list", pocketbookId],
    queryFn,
    enabled: Boolean(pocketbookId),
  });

  return { datesWithUpdates: data ?? [], refetchDatesWithUpdates: refetch };
};
