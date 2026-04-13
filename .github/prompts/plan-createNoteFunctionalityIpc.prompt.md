## Plan: Create Note Functionality via IPC (Electron)

Implement the "create note" feature using Electron IPC instead of HTTP/server functions, and refactor the `useCreateNote` hook to use IPC for desktop environments.

**Steps**

1. **Extract Note Creation Logic**
   - Move the logic from [src/notes/serverFunctions/createNote.ts](src/notes/serverFunctions/createNote.ts) to a new shared module (e.g., `src/notes/db/createNote.ts`)

2. **Register IPC Handler in Electron Main**
   - In [electron/main.ts](electron/main.ts), register an IPC handler (e.g., `ipcMain.handle('notes:create', ...)`) that calls the shared note creation logic.

3. **Expose IPC API in Preload Script**
   - In [electron/preload.ts](electron/preload.ts), use `contextBridge.exposeInMainWorld` to expose a `createNote` function that calls `ipcRenderer.invoke('notes:create', data)`.

4. **Refactor useCreateNote Hook**
   - In [src/notes/hooks/useCreateNote.ts](src/notes/hooks/useCreateNote.ts), replace the use of `useServerFn(createNote)` with a function that calls the exposed IPC API (e.g., `window.api.createNote`).
   - Update the mutation function to use this new IPC-based API.

5. **Type Declarations**
   - Add or update global type declarations for the exposed `api` object to ensure type safety in the renderer process.

6. **Testing and Cleanup**
   - Test the new IPC-based note creation in Electron.

**Relevant files**

- `src/notes/serverFunctions/createNote.ts` — old location of note creation logic, should be removed after extraction
- `src/notes/db/createNote.ts` — new note creation logic
- `electron/main.ts` — register IPC handler
- `electron/preload.ts` — expose IPC API
- `src/notes/hooks/useCreateNote.ts` — refactor to use IPC
- (optional) `src/types/global.d.ts` — declare `window.api` types

**Verification**

1. Create a note in the Electron app and verify it is persisted and returned as expected.
2. Confirm the hook uses IPC and not HTTP/server functions in Electron.
3. Ensure type safety and no runtime errors in both main and renderer processes.
4. (If supporting both web and desktop) Verify correct logic is used in each environment.

**Decisions**

- The note creation logic will be shared between server and Electron main via a new module.
- The hook will use IPC only in Electron;

**Further Considerations**

1. Consider error handling and validation in the IPC handler for robustness.
2. Ensure security by exposing only the required API in the preload script.

Let me know if you want code samples or further breakdowns for any step.
