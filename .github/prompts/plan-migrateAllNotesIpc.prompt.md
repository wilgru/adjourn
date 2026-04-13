## Plan: Migrate All Notes Hooks & DB Logic to IPC Pattern (Based on createNote Example)

**Goal:**  
Refactor all notes-related hooks and DB logic to use the same IPC-based architecture as `createNote`, ensuring all operations (CRUD, tags, etc.) are handled via IPC and exposed to the renderer through a type-safe API.

---

### Steps

#### 1. Identify All Notes Features

- List all hooks and DB logic related to notes (e.g., getNotes, updateNote, deleteNote, getNoteById, tag management, etc.).
- For each, locate:
  - The original DB logic file (e.g., `src/notes/serverFunctions/`)
  - The hook file (e.g., `src/notes/hooks/`)
  - Any related types

#### 2. For Each Feature, Apply the IPC Pattern

**A. DB Logic & IPC Handler**

- Move or refactor the DB logic into a function that takes a plain input object and returns a plain output (or throws).
- In `src/notes/ipc/`, create a file for each feature (e.g., `getNotes.ts`, `updateNote.ts`).
- Use `createIpcHandler` to register the handler:

  ```typescript
  import { createIpcHandler } from "src/common/utils/createIpcHandler";
  import type { IpcApiMethod } from "src/common/types/IpcApiMethod.type";
  // ...other imports...

  export type GetNotesInput = { ... };

  createIpcHandler(
    "notes:getAll",
    (input: GetNotesInput): NoteSchema[] => {
      // DB logic here
      return notesArray;
    }
  );

  declare global {
    interface Window {
      api: {
        getNotes: IpcApiMethod<GetNotesInput, NoteSchema[]>;  // or whatever is appropriate
      };
    }
  }
  ```

**B. Preload Script**

- In `electron/preload.ts`, expose the new API:
  ```typescript
  import type { GetNotesInput } from "src/notes/ipc/getNotes";
  // ...
  contextBridge.exposeInMainWorld("api", {
    // ...existing,
    getNotes: (data: GetNotesInput) => ipcRenderer.invoke("notes:getAll", data),
  });
  ```

**C. Hook Refactor**

- In the corresponding hook (e.g., `useGetNotes.ts`), replace any direct DB/server calls with `window.api.getNotes`.
- Ensure the hook uses the correct input/output types and handles the discriminated union result.

**D. Type Safety**

- as mentioned above, add a global `Window` type declaration in each feature file to ensure type safety when accessing `window.api`, eg:
  ```typescript
  declare global {
    interface Window {
      api: {
        getNotes: IpcApiMethod<GetNotesInput, NoteSchema[]>;
      };
    }
  }
  ```
- Use `IpcApiMethod<Input, Output>` for all API methods.

#### 3. Remove Old Server/Direct DB Logic

- Remove any remaining direct DB or HTTP/server function calls from the renderer.
- Ensure all notes features use the IPC pattern.

#### 4. Testing & Verification

- Test each feature in the Electron app to ensure correct DB operation and error handling.
- Confirm type safety and runtime correctness.

---

### Relevant Files to Update (for each feature)

- `src/notes/ipc/<feature>.ts` — IPC handler and type exports
- `src/notes/db/<feature>.ts` — DB logic (if not already inlined)
- `src/notes/hooks/use<Feature>.ts` — Hook using `window.api.<feature>`
- `electron/preload.ts` — Expose new API methods
- `src/common/types/IpcApiMethod.type.ts` — Utility type for API signatures
- `src/common/utils/createIpcHandler.ts` — IPC handler utility (already set up)
- Global type declarations for `window.api`

---

### Decisions

- All notes features will use the IPC pattern for DB access.
- All renderer code will use `window.api.<feature>` for DB operations.
- All IPC handlers will use the discriminated union result type for error handling.

---
