import { useParams } from "@tanstack/react-router";

export const useCurrentPocketbookId = () => {
  const { pocketbookId } = useParams({ strict: false }); // {strict: false} option means that you want to access the params from an ambiguous location

  return { pocketbookId };
};
