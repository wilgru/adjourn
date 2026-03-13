import { useQuery } from "@tanstack/react-query";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { pb } from "src/pocketbase/utils/connection";
import { mapUpdate } from "src/updates/utils/mapUpdate";
import type { Update } from "src/updates/Update.type";

type UseGetUpdatesResponse = {
  updates: Update[];
};

export const useGetUpdates = ({
  noteId,
}: {
  noteId?: string;
} = {}): UseGetUpdatesResponse => {
  const { journalId } = useCurrentJournalId();

  const queryFn = async (): Promise<Update[]> => {
    const filters = [`journal = '${journalId}'`];

    if (noteId) {
      filters.push(`notes ~ '${noteId}'`);
    }

    const rawUpdates = await pb
      .collection("updates")
      .getList(undefined, undefined, {
        filter: filters.join(" && "),
        expand: "notes",
        sort: "-created",
      });

    return rawUpdates.items.map(mapUpdate);
  };

  const { data } = useQuery({
    queryKey: ["updates.list", journalId, noteId],
    queryFn,
  });

  return { updates: data ?? [] };
};
