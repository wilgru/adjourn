import { useQuery } from "@tanstack/react-query";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapDateWithNotes } from "src/notes/utils/mapDateWithNotes";
import { pb } from "src/pocketbase/utils/connection";
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

    const rawDatesWithUpdates = await pb
      .collection("datesWithUpdates")
      .getList(undefined, undefined, {
        filter: "journal = '" + journalId + "'",
      });

    return rawDatesWithUpdates.items.map(mapDateWithNotes);
  };

  const { data, refetch } = useQuery({
    queryKey: ["datesWithUpdates.list", journalId],
    queryFn,
    enabled: Boolean(journalId),
  });

  return { datesWithUpdates: data ?? [], refetchDatesWithUpdates: refetch };
};
