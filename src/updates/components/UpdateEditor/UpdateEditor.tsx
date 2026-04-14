import { useNavigate } from "@tanstack/react-router";
import Delta from "quill-delta";
import { useState } from "react";
import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
import { QuillEditor } from "src/common/components/QuillEditor/QuillEditor";
import { QuillFormattingToolbar } from "src/common/components/QuillFormattingToolbar/QuillFormattingToolbar";
import QuillViewer from "src/common/components/QuillViewer/QuillViewer";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import { useCurrentPocketbook } from "src/pocketbooks/hooks/useCurrentPocketbook";
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
  showNotes = true,
  dateDisplay = "time",
  onCancel,
  onCreated,
}: UpdateEditorProps) => {
  const { pocketbookId } = useCurrentPocketbook();
  const navigate = useNavigate();

  const { createUpdate } = useCreateUpdate();
  const { updateUpdate } = useUpdateUpdate();
  const { deleteUpdate } = useDeleteUpdate();

  const [editedUpdate, setEditedUpdate] = useState<Partial<Update>>(
    getInitialUpdate(update),
  );
  const [isEditing, setIsEditing] = useState(!update.id);
  const [toolbarFormatting, setToolbarFormatting] = useState<StringMap>();

  const toolbarId = `update-toolbar-${editedUpdate.id || "new"}`;

  const tintClasses = getTintClasses(editedUpdate.tint);
  const resolvedColour =
    (editedUpdate.tint ? TINT_TO_COLOUR[editedUpdate.tint] : undefined) ??
    colours.grey;

  const tintColour = resolvedColour;
  const noteColour = resolvedColour;

  const onUpdateField = (fields: Partial<Update>) => {
    setEditedUpdate((current) => ({ ...current, ...fields }));
  };

  const onDone = async () => {
    if (editedUpdate.id) {
      await updateUpdate({
        updateId: editedUpdate.id,
        updateData: {
          content: editedUpdate.content,
          tint: editedUpdate.tint,
          notes: editedUpdate.notes as Note[],
        },
      });
      setIsEditing(false);
    } else {
      // New update — create explicitly now
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
    if (!editedUpdate.id) {
      onCancel?.();
    } else {
      setEditedUpdate(getInitialUpdate(update));
      setIsEditing(false);
    }
  };

  const onDelete = async () => {
    if (editedUpdate.id) {
      await deleteUpdate({ updateId: editedUpdate.id });
    } else {
      onCancel?.();
    }
  };

  const dateStr = editedUpdate.created
    ? dateDisplay === "date"
      ? editedUpdate.created.format("MMM D, YYYY h:mm a")
      : editedUpdate.created.format("h:mm a")
    : null;

  if (isEditing) {
    return (
      <div className="relative flex items-center gap-4">
        <p className="text-xs text-slate-400 shrink-0 w-32 text-right leading-tight">
          {dateStr ?? ""}
        </p>

        <div className="relative h-full w-4 flex items-center justify-center">
          <div className="absolute h-full pointer-events-none w-0.5 bg-slate-100" />

          <div className="absolute pointer-events-none text-slate-100">
            <Icon iconName="circle" size="xs" />
          </div>
        </div>

        <div
          className={cn(
            "flex-1 rounded-2xl p-4 my-2 flex flex-col gap-3 transition-colors",
            tintClasses.card,
          )}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 pb-3 border-slate-100">
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

          <QuillFormattingToolbar
            toolbarId={toolbarId}
            toolbarFormatting={toolbarFormatting}
            colour={tintColour}
            dividerClass={tintClasses.toolbarDivider}
          />

          <QuillEditor
            toolbarId={toolbarId}
            value={editedUpdate.content}
            colour={tintColour}
            onChange={(delta) => onUpdateField({ content: delta })}
            onSelectedFormattingChange={(formatting) =>
              setToolbarFormatting(formatting)
            }
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button
              size="sm"
              variant="block"
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
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-4">
      <p className="text-xs text-slate-400 shrink-0 w-32 text-right leading-tight">
        {dateStr}
      </p>

      <div className="relative h-full w-4 flex items-center justify-center">
        <div className="absolute h-full pointer-events-none w-0.5 bg-slate-100" />

        <div className="absolute pointer-events-none text-slate-100">
          <Icon iconName="circle" size="xs" />
        </div>
      </div>

      <div
        className={cn(
          "flex-1 rounded-2xl p-4 my-2 flex flex-col gap-3 transition-colors",
          tintClasses.card,
        )}
      >
        {showNotes && (
          <div className="flex justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              {(editedUpdate.notes ?? []).length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  No notes attached
                </span>
              ) : (
                (editedUpdate.notes as Note[]).map((note) => (
                  <button
                    key={note.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate({
                        to: `/${pocketbookId ?? ""}/notes`,
                        search: { noteId: note.id },
                      });
                    }}
                    className={cn(
                      "flex items-center gap-1 pl-2 pr-1 py-1 text-xs rounded-full transition-colors",
                      tintClasses.notePill,
                    )}
                  >
                    {note.title ?? "Untitled Note"}

                    <Icon iconName="arrowCircleRight" size="sm" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <QuillViewer
          content={editedUpdate.content ?? new Delta()}
          textColor={tintClasses.textColor}
          onClick={() => setIsEditing(true)}
        />
      </div>
    </div>
  );
};
