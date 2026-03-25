import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { tasks } from "src/tasks/tasks.schema";

type DeleteTaskInput = {
  taskId: string;
};

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator((input: DeleteTaskInput) => input)
  .handler(async ({ data }): Promise<string> => {
    db.delete(tasks).where(eq(tasks.id, data.taskId)).run();

    return data.taskId;
  });
