import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { useGetJournals } from "src/journals/hooks/useGetJournals";
import type { Journal } from "src/journals/Journal.type";

type UseCurrentJournalResponse = {
  journalId: string | undefined;
  currentJournal: Journal | undefined;
  journals: Journal[];
};

export const useCurrentJournal = (): UseCurrentJournalResponse => {
  const { journalId } = useCurrentJournalId();
  const { journals } = useGetJournals();

  const currentJournal = journals.find((journal) => journal.id === journalId);

  return { journalId, currentJournal, journals };
};
