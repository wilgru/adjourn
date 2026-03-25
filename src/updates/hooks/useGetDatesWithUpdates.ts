import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapDateWithNotes } from "src/notes/utils/mapDateWithNotes";
import { getDatesWithUpdates } from "../serverFunctions/getDatesWithUpdates";
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
  const getDatesWithUpdatesFn = useServerFn(getDatesWithUpdates);

  const queryFn = async (): Promise<DateWithNotes[]> => {
    if (!journalId) {
      return [];
    }

    const result = await getDatesWithUpdatesFn({
      data: { journalId },
    });

    return result.dates.map(mapDateWithNotes);
  };

  const { data, refetch } = useQuery({
    queryKey: ["datesWithUpdates.list", journalId],
    queryFn,
    enabled: Boolean(journalId),
  });

  return { datesWithUpdates: data ?? [], refetchDatesWithUpdates: refetch };
};
