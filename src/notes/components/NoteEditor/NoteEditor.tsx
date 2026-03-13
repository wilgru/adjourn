import {
  CodeBlock,
  LinkSimple,
  ListBullets,
  ListNumbers,
  Quotes,
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
} from "@phosphor-icons/react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useLocation, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import debounce from "debounce";
import { useEffect, useRef, useState } from "react";
import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
import { QuillEditor } from "src/common/components/QuillEditor/QuillEditor";
import { Toggle } from "src/common/components/Toggle/Toggle";
import { useCreateNote } from "src/notes/hooks/useCreateNote";
import { useDeleteNote } from "src/notes/hooks/useDeleteNote";
import { useUpdateNote } from "src/notes/hooks/useUpdateNote";
import { useCreateTask } from "src/tasks/hooks/useCreateTask";
import { TagMultiSelect } from "../../../tags/components/TagMultiSelect/TagMultiSelect";
import { TaskEditor } from "../../../tasks/components/TaskEditor/TaskEditor";
import type { StringMap } from "quill";
import type { Colour } from "src/colours/Colour.type";
import type { Note } from "src/notes/Note.type";

type NoteEditorProps = {
  note: Note;
  colour?: Colour;
  onSave?: () => void;
};

const QUILL_TOOLBAR_ID = "toolbar";

const NoteEditor = ({
  note,
  colour = colours.orange,
  onSave,
}: NoteEditorProps) => {
  const { createNote } = useCreateNote();
  const { createTask } = useCreateTask();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();

  const location = useLocation();
  const navigate = useNavigate();

  const [editedNote, setEditedNote] = useState<Note>(note);
  const [toolbarFormatting, setToolbarFormatting] = useState<StringMap>();
  const [updatedDateVisible, setUpdatedDateVisible] = useState<boolean>(false);

  // Ref that always points to the latest save implementation so the debounced
  // function never closes over stale state.
  const saveRef = useRef<() => void>();
  saveRef.current = () => {
    if (editedNote.id) {
      updateNote({ noteId: editedNote.id, updateNoteData: editedNote });
    } else {
      createNote({ createNoteData: editedNote });
    }
    onSave?.();
  };

  // Stable debounced save – created once and reused across renders.
  const debouncedSave = useRef(
    debounce(() => saveRef.current?.(), 500),
  ).current;

  // When the selected note changes (NoteEditor stays mounted while the note
  // prop switches), flush any pending save for the previous note first so
  // edits aren't lost, then reset state to the new note.
  useEffect(() => {
    debouncedSave.flush();
    setEditedNote(note);
  }, [note]); // eslint-disable-line react-hooks/exhaustive-deps

  // Flush any pending debounced save when the component unmounts (navigation).
  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  const onCreateTask = async () => {
    await createTask({
      createTaskData: {
        note: editedNote,
        title: "New task",
        isFlagged: false,
        link: null,
        description: "",
        dueDate: null,
        completedDate: null,
        cancelledDate: null,
      },
    });
  };

  const onUpdateNote = (updateNoteData: Partial<Note>) => {
    setEditedNote((currentEditedNote) => ({
      ...currentEditedNote,
      ...updateNoteData,
      updated: dayjs(),
    }));
    debouncedSave();
  };

  const onDeleteNote = async () => {
    debouncedSave.clear();
    await deleteNote({ noteId: editedNote.id });

    navigate({
      to: location.pathname,
      search: {
        noteId: null,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 w-[1000px]">
      <div className="flex flex-col gap-2 justify-between border-b-2 border-slate-100 pb-4">
        <textarea
          name="title"
          value={editedNote.title ?? ""}
          placeholder="No Title"
          onChange={(e) => onUpdateNote({ title: e.target.value })}
          className="h-12 text-5xl font-title tracking-tight overflow-y-hidden bg-white placeholder-slate-400 select-none resize-none outline-none"
        />

        <div className="flex flex-row flex-wrap items-center justify-between">
          <div className="flex flex-row flex-wrap gap-2 items-center">
            <p
              className={`${
                updatedDateVisible ? "visible" : "hidden"
              } text-slate-500 text-xs italic`}
            >
              {"(Last edited " +
                editedNote.updated.format("ddd D MMMM YYYY, hh:mm a") +
                ")"}
            </p>

            <TagMultiSelect
              initialTags={editedNote.tags}
              colour={colour}
              onChange={(tags) => onUpdateNote({ tags })}
            />

            <Button
              size="sm"
              variant="ghost"
              colour={colour}
              onClick={onCreateTask}
              iconName="checkCircle"
            />

            <Button
              size="sm"
              variant="ghost"
              colour={colour}
              onClick={() => {}}
              iconName="chatCenteredText"
            />

            <Toggle
              isToggled={editedNote.isBookmarked}
              size="sm"
              colour={colours.red}
              onClick={() =>
                onUpdateNote({ isBookmarked: !editedNote.isBookmarked })
              }
              iconName="bookmark"
            />

            <p
              className="text-slate-500 text-xs"
              onClick={() =>
                setUpdatedDateVisible(
                  (currentUpdatedDateVisible) => !currentUpdatedDateVisible,
                )
              }
            >
              {editedNote.created.format("ddd D MMMM YYYY, hh:mm a")}
            </p>
          </div>

          <div className="flex flex-row flex-wrap gap-2 items-center">
            <Button
              size="sm"
              variant="ghost"
              colour={colours.red}
              onClick={onDeleteNote}
              iconName="trash"
            />
          </div>
        </div>
      </div>

      {note.tasks && note.tasks.length > 0 && (
        <div className="flex flex-col gap-2 justify-between border-b-2 border-slate-100 pb-4">
          {note.tasks.map((task) => (
            <TaskEditor key={task.id} task={task} />
          ))}
        </div>
      )}

      <div className="h-fit" id={QUILL_TOOLBAR_ID}>
        <ToggleGroup.Root
          className="font-medium text-sm flex"
          type="multiple"
          defaultValue={[]}
          value={[
            ...(toolbarFormatting?.bold ? ["bold"] : []),
            ...(toolbarFormatting?.italic ? ["italic"] : []),
            ...(toolbarFormatting?.underline ? ["underline"] : []),
            ...(toolbarFormatting?.strike ? ["strike"] : []),
            ...(toolbarFormatting?.list === "ordered" ? ["ordered"] : []),
            ...(toolbarFormatting?.list === "bullet" ? ["bullet"] : []),
            ...(toolbarFormatting?.align === "center" ? ["center"] : []),
            ...(toolbarFormatting?.blockquote ? ["blockquote"] : []),
            ...(toolbarFormatting?.["code-block"] ? ["code-block"] : []),
            ...(toolbarFormatting?.link ? ["link"] : []),
          ]}
          aria-label="Text alignment"
        >
          <div className="ql-formats flex flex-row gap-1 pr-1 border-r-2 border-slate-100">
            <ToggleGroup.Item
              className="ql-bold rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="bold"
            >
              <TextB size={16} weight="bold" />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className="ql-italic rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="italic"
            >
              <TextItalic size={16} weight="bold" />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className="ql-underline rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="underline"
            >
              <TextUnderline size={16} weight="bold" />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className=" ql-strike rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="strike"
            >
              <TextStrikethrough size={16} weight="bold" />
            </ToggleGroup.Item>
          </div>

          <div className="flex flex-row gap-1 px-1 pr-1 border-r-2 border-slate-100">
            <ToggleGroup.Item
              className=" ql-list rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="ordered"
            >
              <ListNumbers size={16} weight="bold" />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className=" ql-list rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="bullet"
            >
              <ListBullets size={16} weight="bold" />
            </ToggleGroup.Item>
          </div>

          <div className="flex flex-row gap-1 px-1 pr-1">
            <ToggleGroup.Item
              className=" ql-blockquote rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="blockquote"
            >
              <Quotes size={16} weight="bold" />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className=" ql-code-block rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="code-block"
            >
              <CodeBlock size={16} weight="bold" />
            </ToggleGroup.Item>
            <ToggleGroup.Item
              className=" ql-link rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
              value="link"
            >
              <LinkSimple size={16} weight="bold" />
            </ToggleGroup.Item>
          </div>
        </ToggleGroup.Root>
      </div>

      <QuillEditor
        key={editedNote.id}
        toolbarId={QUILL_TOOLBAR_ID}
        value={editedNote.content}
        onChange={(delta) => onUpdateNote({ content: delta })}
        onSelectedFormattingChange={(selectionFormatting: StringMap) => {
          setToolbarFormatting(selectionFormatting);
        }}
      />
    </div>
  );
};

export default NoteEditor;
