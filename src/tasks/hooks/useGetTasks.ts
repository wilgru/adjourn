import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapNote } from "src/notes/utils/mapNote";
import { mapTask } from "src/tasks/utils/mapTask";
import { getTasks } from "../serverFunctions/getTasks";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Task } from "src/tasks/Task.type";

type UseGetTacksResponse = {
  tasks: Task[];
  refetchTags: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<Task[], Error>>;
};

dayjs.extend(utc);

export const useGetTasks = ({
  isFlagged,
  dateString,
}: {
  isFlagged?: boolean;
  dateString?: string;
}): UseGetTacksResponse => {
  const { journalId } = useCurrentJournalId();
  const getTasksFn = useServerFn(getTasks);

  const queryFn = async (): Promise<Task[]> => {
    let createdAfter: string | undefined;
    let createdBefore: string | undefined;

    if (dateString) {
      const localDateMidday = dayjs(dateString)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);

      createdAfter = localDateMidday.utc().subtract(12, "hour").toISOString();

      createdBefore = localDateMidday.utc().add(12, "hour").toISOString();
    }

    const result = await getTasksFn({
      data: {
        journalId: journalId ?? "",
        isFlagged,
        createdAfter,
        createdBefore,
      },
    });

    return result.tasks.map((task) => {
      const noteData = task.note ? result.notes[task.note] : null;
      const note = noteData ? mapNote(noteData) : null;
      return mapTask(task, { note });
    });
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tasks.list", journalId, isFlagged, dateString],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { tasks: data ?? [], refetchTags: refetch };
};
