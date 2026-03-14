import { useNavigate } from "@tanstack/react-router";
import debounce from "debounce";
import Delta from "quill-delta";
import { useEffect, useRef, useState } from "react";
import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
import { QuillEditor } from "src/common/components/QuillEditor/QuillEditor";
import { QuillFormattingToolbar } from "src/common/components/QuillFormattingToolbar/QuillFormattingToolbar";
import QuillViewer from "src/common/components/QuillViewer/QuillViewer";
import { cn } from "src/common/utils/cn";
import { useCurrentJournal } from "src/journals/hooks/useCurrentJournal";
import { NoteMultiSelect } from "src/notes/components/NoteMultiSelect/NoteMultiSelect";
import { useCreateUpdate } from "src/updates/hooks/useCreateUpdate";
import { useDeleteUpdate } from "src/updates/hooks/useDeleteUpdate";
import { useUpdateUpdate } from "src/updates/hooks/useUpdateUpdate";
import { getTintClasses } from "src/updates/utils/getTintClasses";
import type { StringMap } from "quill";
import type { Colour } from "src/colours/Colour.type";
import type { Note } from "src/notes/Note.type";
import type { Update, UpdateTint } from "src/updates/Update.type";

type UpdateEditorProps = {
  update: Partial<Update>;
  colour?: Colour;
  showNotes?: boolean;
  dateDisplay?: "date" | "time";
  onCancel?: () => void;
  onCreated?: () => void;
};

const TINT_OPTIONS: Array<{ value: UpdateTint; bg: string }> = [
  { value: "red", bg: "bg-red-400" },
  { value: "yellow", bg: "bg-yellow-400" },
  { value: "green", bg: "bg-green-400" },
  { value: "blue", bg: "bg-blue-400" },
];

/** Maps a tint to the matching entry in the colours constant, for components that take a Colour. */
const TINT_TO_COLOUR: Partial<Record<UpdateTint, Colour>> = {
  red: colours.red,
  yellow: colours.yellow,
  green: colours.green,
  blue: colours.blue,
};

const getInitialUpdate = (update: Partial<Update>): Partial<Update> => ({
  id: update.id ?? "",
  content: update.content ?? new Delta(),
  tint: update.tint ?? null,
  notes: update.notes ?? [],
  created: update.created,
  updated: update.updated,
});

export const UpdateEditor = ({
  update,
  colour,
  showNotes = true,
  dateDisplay = "time",
  onCancel,
  onCreated,
}: UpdateEditorProps) => {
  const { currentJournal, journalId } = useCurrentJournal();
  const resolvedColour = colour ?? currentJournal?.colour ?? colours.orange;
  const navigate = useNavigate();

  const { createUpdate } = useCreateUpdate();
  const { updateUpdate } = useUpdateUpdate();
  const { deleteUpdate } = useDeleteUpdate();

  const [editedUpdate, setEditedUpdate] = useState<Partial<Update>>(
    getInitialUpdate(update),
  );
  const [isEditing, setIsEditing] = useState(!update.id);
  const [toolbarFormatting, setToolbarFormatting] = useState<StringMap>();
  const [isHovered, setIsHovered] = useState(false);

  const toolbarId = `update-toolbar-${editedUpdate.id || "new"}`;

  const tintClasses = getTintClasses(editedUpdate.tint);
  /** Colour used for toolbar buttons and NoteMultiSelect when a tint is active. */
  const tintColour = editedUpdate.tint
    ? (TINT_TO_COLOUR[editedUpdate.tint] ?? resolvedColour)
    : resolvedColour;
  /** Colour used for NoteMultiSelect pills — grey when no tint. */
  const noteColour = editedUpdate.tint
    ? (TINT_TO_COLOUR[editedUpdate.tint] ?? colours.grey)
    : colours.grey;

  const saveRef = useRef<() => Promise<void>>();
  saveRef.current = async () => {
    if (editedUpdate.id) {
      await updateUpdate({
        updateId: editedUpdate.id,
        updateData: {
          content: editedUpdate.content,
          tint: editedUpdate.tint,
          notes: editedUpdate.notes as Note[],
        },
      });
    }
  };

  const debouncedSave = useRef(
    debounce(() => saveRef.current?.(), 500),
  ).current;

  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  const onUpdateField = (fields: Partial<Update>) => {
    setEditedUpdate((current) => ({ ...current, ...fields }));
    // Only auto-save existing updates; new ones are saved explicitly via the Save button
    if (editedUpdate.id) {
      debouncedSave();
    }
  };

  const onDone = async () => {
    if (editedUpdate.id) {
      // Existing update — flush any pending debounced save then close
      debouncedSave.flush();
      setIsEditing(false);
    } else {
      // New update — create explicitly now (no prior auto-save)
      const created = await createUpdate({
        createUpdateData: {
          content: editedUpdate.content!,
          tint: editedUpdate.tint ?? null,
          notes: (editedUpdate.notes ?? []) as Note[],
        },
      });
      if (created) {
        onCreated?.();
      }
    }
  };

  const onCancelEdit = () => {
    debouncedSave.clear();
    if (!editedUpdate.id) {
      onCancel?.();
    } else {
      setEditedUpdate(getInitialUpdate(update));
      setIsEditing(false);
    }
  };

  const onDelete = async () => {
    debouncedSave.clear();
    if (editedUpdate.id) {
      await deleteUpdate({ updateId: editedUpdate.id });
    } else {
      onCancel?.();
    }
  };

  const dateStr = editedUpdate.created
    ? dateDisplay === "date"
      ? editedUpdate.created.format("MMM D, YYYY")
      : editedUpdate.created.format("h:mm a")
    : null;

  if (isEditing) {
    return (
      <div
        className={cn(
          "rounded-2xl border p-4 flex flex-col gap-3",
          tintClasses.card,
        )}
      >
        {/* Top row: note selector (left) + tint picker (right) */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <NoteMultiSelect
            selectedNotes={(editedUpdate.notes ?? []) as Note[]}
            colour={noteColour}
            onChange={(notes) => onUpdateField({ notes })}
          />

          <div className="flex gap-1.5 items-center">
            <button
              onClick={() => onUpdateField({ tint: null })}
              className={cn(
                "h-5 w-5 rounded-full border-2 bg-slate-200",
                editedUpdate.tint === null
                  ? "border-slate-500"
                  : "border-transparent",
              )}
              title="No colour"
            />
            {TINT_OPTIONS.map(({ value, bg }) => (
              <button
                key={value}
                onClick={() => onUpdateField({ tint: value })}
                className={cn(
                  "h-5 w-5 rounded-full border-2",
                  bg,
                  editedUpdate.tint === value
                    ? "border-slate-600"
                    : "border-transparent",
                )}
                title={value}
              />
            ))}
          </div>
        </div>

        {/* Formatting toolbar */}
        <QuillFormattingToolbar
          toolbarId={toolbarId}
          toolbarFormatting={toolbarFormatting}
          colour={tintColour}
          dividerClass={tintClasses.toolbarDivider}
        />

        {/* Editor */}
        <QuillEditor
          toolbarId={toolbarId}
          value={editedUpdate.content}
          colour={tintColour}
          onChange={(delta) => onUpdateField({ content: delta })}
          onSelectedFormattingChange={(formatting) =>
            setToolbarFormatting(formatting)
          }
        />

        {/* Bottom row: delete text button (left) + discard/save (right) */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button
            size="sm"
            variant="ghost"
            colour={colours.red}
            className="text-red-500"
            onClick={onDelete}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              colour={tintColour}
              onClick={onCancelEdit}
            >
              Discard
            </Button>
            <Button
              size="sm"
              variant="block"
              colour={tintColour}
              onClick={onDone}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* Date on the left, outside the card */}
      <p className="text-xs text-slate-400 shrink-0 pt-3 w-24 text-right whitespace-nowrap">
        {dateStr}
      </p>

      {/* Card */}
      <div
        className={cn(
          "flex-1 rounded-2xl border p-4 flex flex-col gap-3 transition-colors",
          tintClasses.card,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top row: note pills (optional, left only) */}
        {showNotes && (
          <div className="flex flex-wrap gap-2 items-center">
            {(editedUpdate.notes ?? []).length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                No notes attached
              </span>
            ) : (
              (editedUpdate.notes as Note[]).map((note) => (
                <button
                  key={note.id}
                  onClick={() =>
                    navigate({
                      to: `/${journalId ?? ""}/notes`,
                      search: { noteId: note.id },
                    })
                  }
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors",
                    tintClasses.notePill,
                  )}
                >
                  {note.title ?? "Untitled Note"}
                </button>
              ))
            )}
          </div>
        )}

        {/* Content */}
        <QuillViewer
          content={editedUpdate.content ?? new Delta()}
          textColor={tintClasses.textColor}
        />

        {/* Bottom row: edit/delete icons (right, hover-only) */}
        <div className="flex justify-end">
          <div
            className={cn(
              "flex items-center gap-1 transition-opacity",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <Button
              size="sm"
              variant="ghost"
              colour={tintColour}
              iconName="pencil"
              onClick={() => setIsEditing(true)}
            />
            <Button
              size="sm"
              variant="ghost"
              colour={colours.red}
              iconName="trash"
              onClick={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
