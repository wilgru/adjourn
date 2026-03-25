import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mapNote } from "src/notes/utils/mapNote";
import { mapTask } from "src/tasks/utils/mapTask";
import { updateTask } from "../serverFunctions/updateTask";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Task } from "src/tasks/Task.type";

type UpdateTaskProps = {
  taskId: string;
  updateTaskData: Task;
};

type UseUpdateTaskResponse = {
  updateTask: UseMutateAsyncFunction<
    Task | undefined,
    Error,
    UpdateTaskProps,
    unknown
  >;
};

export const useUpdateTask = (): UseUpdateTaskResponse => {
  const queryClient = useQueryClient();
  const updateTaskFn = useServerFn(updateTask);

  const mutationFn = async ({
    taskId,
    updateTaskData,
  }: UpdateTaskProps): Promise<Task | undefined> => {
    const result = await updateTaskFn({
      data: {
        taskId,
        title: updateTaskData.title,
        description: updateTaskData.description,
        link: updateTaskData.link,
        isFlagged: updateTaskData.isFlagged,
        noteId: updateTaskData.note?.id ?? null,
        dueDate: updateTaskData.dueDate?.toISOString() ?? null,
        completedDate: updateTaskData.completedDate?.toISOString() ?? null,
        cancelledDate: updateTaskData.cancelledDate?.toISOString() ?? null,
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
      queryKey: ["tags.get"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tasks.update"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { updateTask: mutateAsync };
};
