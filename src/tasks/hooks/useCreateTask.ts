import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { mapNote } from "src/notes/utils/mapNote";
import { mapTask } from "src/tasks/utils/mapTask";
import { createTask } from "../serverFunctions/createTask";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Task } from "src/tasks/Task.type";

type CreateTaskProps = {
  createTaskData: Omit<Task, "id" | "created" | "updated">;
};

type UseCreateTaskResponse = {
  createTask: UseMutateAsyncFunction<
    Task | undefined,
    Error,
    CreateTaskProps,
    unknown
  >;
};

export const useCreateTask = (): UseCreateTaskResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const createTaskFn = useServerFn(createTask);

  const mutationFn = async ({
    createTaskData,
  }: CreateTaskProps): Promise<Task | undefined> => {
    const result = await createTaskFn({
      data: {
        title: createTaskData.title,
        description: createTaskData.description,
        link: createTaskData.link,
        isFlagged: createTaskData.isFlagged,
        noteId: createTaskData.note?.id ?? null,
        dueDate: createTaskData.dueDate?.toISOString() ?? null,
        completedDate: createTaskData.completedDate?.toISOString() ?? null,
        cancelledDate: createTaskData.cancelledDate?.toISOString() ?? null,
        journalId: journalId ?? null,
        userId: user?.id ?? null,
      },
    });

    const note = result.note ? mapNote(result.note) : null;
    return mapTask(result.task, { note });
  };

  const onSuccess = (data: Task | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tasks.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["notes.get", data.note?.id],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tasks.create"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { createTask: mutateAsync };
};
