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
  onCancel?: () => void;
};

const TINT_OPTIONS: Array<{ value: UpdateTint; bg: string }> = [
  { value: "red", bg: "bg-red-400" },
  { value: "yellow", bg: "bg-yellow-400" },
  { value: "green", bg: "bg-green-400" },
  { value: "blue", bg: "bg-blue-400" },
];

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
  onCancel,
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
    } else {
      const created = await createUpdate({
        createUpdateData: {
          content: editedUpdate.content!,
          tint: editedUpdate.tint ?? null,
          notes: (editedUpdate.notes ?? []) as Note[],
        },
      });
      if (created) {
        setEditedUpdate((prev) => ({ ...prev, id: created.id }));
      }
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
    debouncedSave();
  };

  const onDone = async () => {
    debouncedSave.flush();
    setIsEditing(false);
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

  const tintClasses = getTintClasses(editedUpdate.tint);

  if (isEditing) {
    return (
      <div
        className={cn(
          "rounded-2xl border p-4 flex flex-col gap-3",
          tintClasses.card,
        )}
      >
        <div className="flex items-center justify-between flex-wrap">
          <QuillFormattingToolbar
            toolbarId={toolbarId}
            toolbarFormatting={toolbarFormatting}
            colour={resolvedColour}
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

        <QuillEditor
          toolbarId={toolbarId}
          value={editedUpdate.content}
          colour={resolvedColour}
          onChange={(delta) => onUpdateField({ content: delta })}
          onSelectedFormattingChange={(formatting) =>
            setToolbarFormatting(formatting)
          }
        />

        <div className="flex items-center justify-between flex-wrap">
          <NoteMultiSelect
            selectedNotes={(editedUpdate.notes ?? []) as Note[]}
            colour={resolvedColour}
            onChange={(notes) => onUpdateField({ notes })}
          />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              colour={colours.red}
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="block"
              colour={resolvedColour}
              onClick={onDone}
            >
              Done
            </Button>
            {editedUpdate.id && (
              <Button
                size="sm"
                variant="ghost"
                colour={colours.red}
                iconName="trash"
                onClick={onDelete}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex flex-col gap-3 transition-colors",
        tintClasses.card,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <QuillViewer content={editedUpdate.content ?? new Delta()} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
                    "flex items-center gap-1 px-2 py-0.5 text-xs rounded-full transition-colors",
                    tintClasses.notePill,
                  )}
                >
                  {note.title ?? "Untitled Note"}
                </button>
              ))
            )}
          </div>

          <p className={cn("text-xs", tintClasses.meta)}>
            {editedUpdate.created?.format("h:mm a")}
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-1 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        >
          <Button
            size="sm"
            variant="ghost"
            colour={resolvedColour}
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
  );
};
