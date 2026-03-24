import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteTask } from "../serverFunctions/deleteTask";
import { useGetTasks } from "./useGetTasks";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

type deleteTaskProps = {
  taskId: string;
};

type UseDeleteTaskResponse = {
  deleteTask: UseMutateAsyncFunction<
    string | undefined,
    Error,
    deleteTaskProps,
    unknown
  >;
};

export const useDeleteTask = (): UseDeleteTaskResponse => {
  const queryClient = useQueryClient();
  const { tasks } = useGetTasks({});
  const deleteTaskFn = useServerFn(deleteTask);

  const mutationFn = async ({
    taskId,
  }: deleteTaskProps): Promise<string | undefined> => {
    const taskToDelete = tasks.find((task) => task.id === taskId);

    if (!taskToDelete) {
      return;
    }

    await deleteTaskFn({ data: { taskId } });

    return taskId;
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["tasks.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tags.get"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tasks.delete"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { deleteTask: mutateAsync };
};
