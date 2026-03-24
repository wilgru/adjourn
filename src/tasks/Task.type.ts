import type { TaskSchema } from "./tasks.schema";
import type { Dayjs } from "dayjs";
import type { Note } from "src/notes/Note.type";

export type Task = Omit<
  TaskSchema,
  | "note"
  | "dueDate"
  | "completedDate"
  | "cancelledDate"
  | "journal"
  | "user"
  | "created"
  | "updated"
> & {
  note: Note | null;
  dueDate: Dayjs | null;
  completedDate: Dayjs | null;
  cancelledDate: Dayjs | null;
  created: Dayjs;
  updated: Dayjs;
};

export type TasksGroup = {
  title: string;
  tasks: Task[];
  relevantTaskData: Partial<Task>;
};
