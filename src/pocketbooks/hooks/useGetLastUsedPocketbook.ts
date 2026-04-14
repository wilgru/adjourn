import { useGetPocketbooks } from "./useGetPocketbooks";
import type { Pocketbook } from "src/pocketbooks/Pocketbook.type";

export const useNavigateToLastUsedPocketbook = (): {
  lastUsedPocketbook: Pocketbook | null;
  isFetching: boolean;
} => {
  const { pocketbooks, isFetching } = useGetPocketbooks();

  const lastUsedPocketbookId =
    typeof window !== "undefined"
      ? localStorage.getItem("lastUsedPocketbookId")
      : null;

  if (pocketbooks.length === 0) {
    return { lastUsedPocketbook: null, isFetching };
  }

  const lastUsedPocketbook = !lastUsedPocketbookId
    ? null
    : (pocketbooks.find((pocketbook) => pocketbook.id === lastUsedPocketbookId) ?? null);

  if (!lastUsedPocketbook) {
    const firstPocketbook = pocketbooks[0];
    localStorage.setItem("lastUsedPocketbookId", firstPocketbook.id);

    return { lastUsedPocketbook: firstPocketbook, isFetching };
  }

  return { lastUsedPocketbook, isFetching };
};
