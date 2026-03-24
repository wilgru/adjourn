import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mapJournal } from "src/journals/utils/mapJournal";
import { getJournals } from "../serverFunctions/getJournals";
import type { Journal } from "src/journals/Journal.type";

type UseGetJournalsResponse = {
  journals: Journal[];
  isFetching: boolean;
};

export const useGetJournals = (): UseGetJournalsResponse => {
  const getJournalsFn = useServerFn(getJournals);

  const queryFn = async (): Promise<{
    journals: Journal[];
  }> => {
    const result = await getJournalsFn();

    const journals = result.journals.map((journal) => ({
      ...mapJournal(journal),
      noteCount: journal.noteCount,
      taskCount: journal.taskCount,
    }));

    return { journals };
  };

  // TODO: consider time caching for better performance
  const { data, isPending } = useQuery({
    queryKey: ["journals.list"],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    journals: data?.journals ?? [],
    // Only treat the very first load as blocking; background refetches should not blank UI.
    isFetching: isPending,
  };
};
