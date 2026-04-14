import { contextBridge, ipcRenderer } from "electron";
import type { CreateNoteInput } from "src/notes/ipc/createNote";
import type { DeleteNoteInput } from "src/notes/ipc/deleteNote";
import type { GetNoteInput } from "src/notes/ipc/getNote";
import type { GetNotesInput } from "src/notes/ipc/getNotes";
import type { UpdateNoteInput } from "src/notes/ipc/updateNote";
import type { CreatePocketbookInput } from "src/pocketbooks/ipc/createPocketbook";
import type { GetPocketbookInput } from "src/pocketbooks/ipc/getPocketbook";
import type { GetPocketbooksInput } from "src/pocketbooks/ipc/getPocketbooks";
import type { UpdatePocketbookInput } from "src/pocketbooks/ipc/updatePocketbook";
import type { DeletePocketbookInput } from "src/pocketbooks/ipc/deletePocketbook";
import type { CreateTaskInput } from "src/tasks/ipc/createTask";
import type { GetTaskInput } from "src/tasks/ipc/getTask";
import type { GetTasksInput } from "src/tasks/ipc/getTasks";
import type { UpdateTaskInput } from "src/tasks/ipc/updateTask";
import type { DeleteTaskInput } from "src/tasks/ipc/deleteTask";
import type { CreateTagInput } from "src/tags/ipc/createTag";
import type { GetTagInput } from "src/tags/ipc/getTag";
import type { GetTagsInput } from "src/tags/ipc/getTags";
import type { UpdateTagInput } from "src/tags/ipc/updateTag";
import type { DeleteTagInput } from "src/tags/ipc/deleteTag";
import type { CreateTagGroupInput } from "src/tags/ipc/createTagGroup";
import type { UpdateTagGroupInput } from "src/tags/ipc/updateTagGroup";
import type { DeleteTagGroupInput } from "src/tags/ipc/deleteTagGroup";
import type { CreateUpdateInput } from "src/updates/ipc/createUpdate";
import type { GetUpdateInput } from "src/updates/ipc/getUpdate";
import type { GetUpdatesInput } from "src/updates/ipc/getUpdates";
import type { UpdateUpdateInput } from "src/updates/ipc/updateUpdate";
import type { DeleteUpdateInput } from "src/updates/ipc/deleteUpdate";

contextBridge.exposeInMainWorld("api", {
  createNote: (data: CreateNoteInput) =>
    ipcRenderer.invoke("notes:create", data),
  getNotes: (data: GetNotesInput) => ipcRenderer.invoke("notes:getAll", data),
  getNote: (data: GetNoteInput) => ipcRenderer.invoke("notes:getOne", data),
  updateNote: (data: UpdateNoteInput) =>
    ipcRenderer.invoke("notes:update", data),
  deleteNote: (data: DeleteNoteInput) =>
    ipcRenderer.invoke("notes:delete", data),

  createPocketbook: (data: CreatePocketbookInput) =>
    ipcRenderer.invoke("pocketbooks:create", data),
  getPocketbooks: (data: GetPocketbooksInput) =>
    ipcRenderer.invoke("pocketbooks:getAll", data),
  getPocketbook: (data: GetPocketbookInput) =>
    ipcRenderer.invoke("pocketbooks:getOne", data),
  updatePocketbook: (data: UpdatePocketbookInput) =>
    ipcRenderer.invoke("pocketbooks:update", data),
  deletePocketbook: (data: DeletePocketbookInput) =>
    ipcRenderer.invoke("pocketbooks:delete", data),

  createTask: (data: CreateTaskInput) =>
    ipcRenderer.invoke("tasks:create", data),
  getTasks: (data: GetTasksInput) => ipcRenderer.invoke("tasks:getAll", data),
  getTask: (data: GetTaskInput) => ipcRenderer.invoke("tasks:getOne", data),
  updateTask: (data: UpdateTaskInput) =>
    ipcRenderer.invoke("tasks:update", data),
  deleteTask: (data: DeleteTaskInput) =>
    ipcRenderer.invoke("tasks:delete", data),

  createTag: (data: CreateTagInput) => ipcRenderer.invoke("tags:create", data),
  getTags: (data: GetTagsInput) => ipcRenderer.invoke("tags:getAll", data),
  getTag: (data: GetTagInput) => ipcRenderer.invoke("tags:getOne", data),
  updateTag: (data: UpdateTagInput) => ipcRenderer.invoke("tags:update", data),
  deleteTag: (data: DeleteTagInput) => ipcRenderer.invoke("tags:delete", data),
  createTagGroup: (data: CreateTagGroupInput) =>
    ipcRenderer.invoke("tagGroups:create", data),
  updateTagGroup: (data: UpdateTagGroupInput) =>
    ipcRenderer.invoke("tagGroups:update", data),
  deleteTagGroup: (data: DeleteTagGroupInput) =>
    ipcRenderer.invoke("tagGroups:delete", data),

  createUpdate: (data: CreateUpdateInput) =>
    ipcRenderer.invoke("updates:create", data),
  getUpdates: (data: GetUpdatesInput) =>
    ipcRenderer.invoke("updates:getAll", data),
  getUpdate: (data: GetUpdateInput) =>
    ipcRenderer.invoke("updates:getOne", data),
  updateUpdate: (data: UpdateUpdateInput) =>
    ipcRenderer.invoke("updates:update", data),
  deleteUpdate: (data: DeleteUpdateInput) =>
    ipcRenderer.invoke("updates:delete", data),
});
