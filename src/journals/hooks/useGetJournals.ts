import { useQuery } from "@tanstack/react-query";
import { mapJournal } from "src/journals/utils/mapJournal";
import { pb } from "src/pocketbase/utils/connection";
import type { Journal } from "src/journals/Journal.type";

type UseGetJournalsResponse = {
  journals: Journal[];
  isFetching: boolean;
};

export const useGetJournals = (): UseGetJournalsResponse => {
  const shouldFetchJournals =
    typeof window !== "undefined" && !!pb.authStore?.isValid;

  const queryFn = async (): Promise<{
    journals: Journal[];
  }> => {
    const rawJournals = await pb
      .collection("journals")
      .getList(undefined, undefined, {
        expand: "notes_via_journal, tasks_via_journal",
      });

    const journals = rawJournals.items.map((journal) => {
      const noteCount = journal.expand?.notes_via_journal?.length ?? 0;
      const taskCount = journal.expand?.tasks_via_journal?.length ?? 0;

      return {
        ...mapJournal(journal),
        noteCount,
        taskCount,
      };
    });

    return { journals };
  };

  // TODO: consider time caching for better performance
  const { data, isPending } = useQuery({
    queryKey: ["journals.list"],
    queryFn,
    enabled: shouldFetchJournals,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    journals: data?.journals ?? [],
    // Only treat the very first load as blocking; background refetches should not blank UI.
    isFetching: isPending,
  };
};
