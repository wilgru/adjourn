import { useCurrentPocketbookId } from "src/pocketbooks/hooks/useCurrentPocketbookId";
import { useGetPocketbooks } from "src/pocketbooks/hooks/useGetPocketbooks";
import type { Pocketbook } from "src/pocketbooks/Pocketbook.type";

type UseCurrentPocketbookResponse = {
  pocketbookId: string | undefined;
  currentPocketbook: Pocketbook | undefined;
  pocketbooks: Pocketbook[];
  isFetchingPocketbooks: boolean;
};

export const useCurrentPocketbook = (): UseCurrentPocketbookResponse => {
  const { pocketbookId } = useCurrentPocketbookId();
  const { pocketbooks, isFetching } = useGetPocketbooks();

  const currentPocketbook = pocketbooks.find((pocketbook) => pocketbook.id === pocketbookId);

  return {
    pocketbookId,
    currentPocketbook,
    pocketbooks,
    isFetchingPocketbooks: isFetching,
  };
};
