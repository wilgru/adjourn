import { useQuery } from "@tanstack/react-query";
import { useUser } from "src/Users/hooks/useUser";
import { mapJournal } from "src/journals/utils/mapJournal";
import type { Journal } from "src/journals/Journal.type";

type UseGetJournalsResponse = {
  journals: Journal[];
  isFetching: boolean;
};

export const useGetJournals = (): UseGetJournalsResponse => {
  const { user } = useUser();

  const queryFn = async (): Promise<{
    journals: Journal[];
  }> => {
    const response = await window.api.getJournals({ userId: user?.id ?? null });
    if (!response.success) throw new Error(response.error);

    const journals = response.data.journals.map((journal) =>
      mapJournal(journal),
    );

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
