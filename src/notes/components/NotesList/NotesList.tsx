import { NoteListItem } from "./NoteListItem";
import type { Colour } from "src/colours/Colour.type";
import type { NotesGroup } from "src/notes/Note.type";

type NotesListProps = {
  noteGroup: NotesGroup;
  createdDateFormat?: string;
  colour: Colour;
};

export const NotesList = ({
  noteGroup,
  createdDateFormat,
  colour,
}: NotesListProps) => {
  return (
    <section>
      <div className="flex flex-col gap-1 items-start">
        {noteGroup.title && (
          <p className="text-slate-400 text-xs">{noteGroup.title}</p>
        )}

        {noteGroup.notes.map((note) => (
          <NoteListItem
            key={note.id}
            note={note}
            createdDateFormat={createdDateFormat}
            colour={colour}
          />
        ))}
      </div>
    </section>
  );
};
