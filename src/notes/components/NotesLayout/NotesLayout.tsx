import { useMemo } from "react";
import { colours } from "src/colours/colours.constant";
import { EmptyState } from "src/common/components/EmptyState/EmptyState";
import { NoteLinkPill } from "src/common/components/NoteLinkPill/NoteLinkPill";
import NoteEditor from "src/notes/components/NoteEditor/NoteEditor";
import { groupNotes } from "src/notes/utils/groupNotes";
import { NotesList } from "../NotesList/NotesList";
import type { Colour } from "src/colours/Colour.type";
import type { Note, NotesGroup } from "src/notes/Note.type";
import type { TagLink } from "src/tags/Tag.type";

type NotesLayoutProps = {
  title: string;
  colour?: Colour;
  notes: Note[];
  selectedNote: Note | null;
  showNoteCreateTimeOnly?: boolean;
  description: string | null;
  links?: TagLink[];
  prefillNewNoteData?: Partial<Note>;
  groupNotesBy?: "created" | "tag";
  groupSortDirection?: "asc" | "desc";
  onCreateNote?: () => void;
};

export const NotesLayout = ({
  title,
  colour = colours.orange,
  notes,
  selectedNote,
  showNoteCreateTimeOnly = false,
  description,
  links,
  prefillNewNoteData,
  groupNotesBy,
  groupSortDirection = "desc",
  onCreateNote,
}: NotesLayoutProps) => {
  const noteGroups = useMemo<NotesGroup[]>(() => {
    if (!notes || notes.length === 0) {
      return [];
    }

    if (!groupNotesBy) {
      return [
        {
          title: null,
          notes: notes,
          relevantNoteData: prefillNewNoteData ?? {},
        },
      ];
    }

    return groupNotes(
      notes,
      groupNotesBy,
      title,
      prefillNewNoteData ?? {},
      groupSortDirection,
    );
  }, [notes, groupNotesBy, title, prefillNewNoteData, groupSortDirection]);

  // FIXME: pb-16 is the height of the toolbar to fix issue with scrolling body getting cut off. Issue to do with not having a fixed height on consuming element and children elements before this one pushing this one down.
  return (
    <div className="h-full w-full min-w-0 pb-16 flex">
      <div className="h-full w-80 px-6 flex flex-col gap-6 overflow-y-scroll border-r-2 border-slate-100">
        {(description || (links && links.length > 0)) && (
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col gap-2">
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}

            {links &&
              links.map((link, index) => (
                <NoteLinkPill key={index} link={link} colour={colour} />
              ))}
          </div>
        )}

        <div className="h-full">
          {noteGroups.map((noteGroup) => (
            <NotesList
              key={noteGroup.title ?? "no-title"}
              noteGroup={noteGroup}
              colour={colour}
              createdDateFormat={
                showNoteCreateTimeOnly || groupNotesBy === "created"
                  ? "h:mm a"
                  : undefined
              }
            />
          ))}

          {noteGroups.length === 0 && (
            <EmptyState text="No notes yet" onAdd={onCreateNote} />
          )}
        </div>
      </div>

      <div className="h-full w-full flex justify-center overflow-y-scroll">
        {selectedNote ? (
          <NoteEditor note={selectedNote} colour={colour} />
        ) : (
          <div className="h-full w-full flex flex-col justify-center items-center text-center">
            <h1 className="text-gray-400 text-lg">No note selected</h1>
          </div>
        )}
      </div>
    </div>
  );
};
