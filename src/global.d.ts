import type { IpcApiMethod } from "src/common/types/IpcApiMethod.type";
import type { CreateNoteInput } from "src/notes/ipc/createNote";
import type { DeleteNoteInput } from "src/notes/ipc/deleteNote";
import type { GetNoteInput } from "src/notes/ipc/getNote";
import type { GetNoteResult } from "src/notes/ipc/getNote";
import type { GetNotesInput } from "src/notes/ipc/getNotes";
import type { GetNotesResult } from "src/notes/ipc/getNotes";
import type { UpdateNoteInput } from "src/notes/ipc/updateNote";
import type { NoteSchema } from "src/notes/notes.schema";
import type { CreatePocketbookInput } from "src/pocketbooks/ipc/createPocketbook";
import type { GetPocketbookInput } from "src/pocketbooks/ipc/getPocketbook";
import type {
  GetPocketbooksInput,
  GetPocketbooksResult,
} from "src/pocketbooks/ipc/getPocketbooks";
import type { UpdatePocketbookInput } from "src/pocketbooks/ipc/updatePocketbook";
import type { DeletePocketbookInput } from "src/pocketbooks/ipc/deletePocketbook";
import type { PocketbookSchema } from "src/pocketbooks/pocketbooks.schema";
import type { CreateTaskInput } from "src/tasks/ipc/createTask";
import type { GetTaskInput } from "src/tasks/ipc/getTask";
import type { GetTasksInput, GetTasksResult } from "src/tasks/ipc/getTasks";
import type { UpdateTaskInput } from "src/tasks/ipc/updateTask";
import type { DeleteTaskInput } from "src/tasks/ipc/deleteTask";
import type { TaskSchema } from "src/tasks/tasks.schema";
import type { CreateTagInput } from "src/tags/ipc/createTag";
import type { GetTagInput } from "src/tags/ipc/getTag";
import type { GetTagsInput, GetTagsResult } from "src/tags/ipc/getTags";
import type { UpdateTagInput } from "src/tags/ipc/updateTag";
import type { DeleteTagInput } from "src/tags/ipc/deleteTag";
import type { CreateTagGroupInput } from "src/tags/ipc/createTagGroup";
import type { UpdateTagGroupInput } from "src/tags/ipc/updateTagGroup";
import type { DeleteTagGroupInput } from "src/tags/ipc/deleteTagGroup";
import type { TagSchema, TagGroupSchema } from "src/tags/tags.schema";
import type { CreateUpdateInput } from "src/updates/ipc/createUpdate";
import type {
  GetUpdateInput,
  GetUpdateResult,
} from "src/updates/ipc/getUpdate";
import type {
  GetUpdatesInput,
  GetUpdatesResult,
} from "src/updates/ipc/getUpdates";
import type { UpdateUpdateInput } from "src/updates/ipc/updateUpdate";
import type { DeleteUpdateInput } from "src/updates/ipc/deleteUpdate";
import type { UpdateSchema } from "src/updates/updates.schema";

declare global {
  interface Window {
    api: {
      createNote: IpcApiMethod<CreateNoteInput, NoteSchema>;
      getNotes: IpcApiMethod<GetNotesInput, GetNotesResult>;
      getNote: IpcApiMethod<GetNoteInput, GetNoteResult>;
      updateNote: IpcApiMethod<UpdateNoteInput, NoteSchema>;
      deleteNote: IpcApiMethod<DeleteNoteInput, string>;

      createPocketbook: IpcApiMethod<CreatePocketbookInput, PocketbookSchema>;
      getPocketbooks: IpcApiMethod<GetPocketbooksInput, GetPocketbooksResult>;
      getPocketbook: IpcApiMethod<GetPocketbookInput, PocketbookSchema>;
      updatePocketbook: IpcApiMethod<UpdatePocketbookInput, PocketbookSchema>;
      deletePocketbook: IpcApiMethod<DeletePocketbookInput, string>;

      createTask: IpcApiMethod<CreateTaskInput, TaskSchema>;
      getTasks: IpcApiMethod<GetTasksInput, GetTasksResult>;
      getTask: IpcApiMethod<GetTaskInput, TaskSchema>;
      updateTask: IpcApiMethod<UpdateTaskInput, TaskSchema>;
      deleteTask: IpcApiMethod<DeleteTaskInput, string>;

      createTag: IpcApiMethod<CreateTagInput, TagSchema>;
      getTags: IpcApiMethod<GetTagsInput, GetTagsResult>;
      getTag: IpcApiMethod<GetTagInput, TagSchema>;
      updateTag: IpcApiMethod<UpdateTagInput, TagSchema>;
      deleteTag: IpcApiMethod<DeleteTagInput, string>;
      createTagGroup: IpcApiMethod<CreateTagGroupInput, TagGroupSchema>;
      updateTagGroup: IpcApiMethod<UpdateTagGroupInput, TagGroupSchema>;
      deleteTagGroup: IpcApiMethod<DeleteTagGroupInput, string>;

      createUpdate: IpcApiMethod<CreateUpdateInput, UpdateSchema>;
      getUpdates: IpcApiMethod<GetUpdatesInput, GetUpdatesResult>;
      getUpdate: IpcApiMethod<GetUpdateInput, GetUpdateResult>;
      updateUpdate: IpcApiMethod<UpdateUpdateInput, UpdateSchema>;
      deleteUpdate: IpcApiMethod<DeleteUpdateInput, string>;
    };
  }
}

export {};
