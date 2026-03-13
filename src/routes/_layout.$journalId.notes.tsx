import { createFileRoute, redirect } from "@tanstack/react-router";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import { colours } from "src/colours/colours.constant";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { useGetJournals } from "src/journals/hooks/useGetJournals";
import { NotesLayout } from "src/notes/components/NotesLayout/NotesLayout";
import { useGetNote } from "src/notes/hooks/useGetNote";
import { useGetNotes } from "src/notes/hooks/useGetNotes";

export const Route = createFileRoute("/_layout/$journalId/notes")({
  component: NotesComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          // (Do not use `router.state.resolvedLocation` as it can potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
  validateSearch: (
    search: Record<string, unknown>,
  ): { noteId: string | null } => {
    return {
      noteId: typeof search.noteId === "string" ? search.noteId : null,
    };
  },
});

function NotesComponent() {
  const { journalId } = Route.useParams();
  const { journals } = useGetJournals();
  const currentJournal = journals.find((journal) => journal.id === journalId);
  const colour = currentJournal?.colour ?? colours.orange;

  const { notes } = useGetNotes({
    createdDateString: undefined,
    isBookmarked: undefined,
  });
  const { noteId } = Route.useSearch(); // TODO: use in loaders?
  const { note } = useGetNote({ noteId });

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="pencil" title={"Notes"} colour={colour} />

      <NotesLayout
        title={"Notes"}
        notes={notes}
        colour={colour}
        selectedNote={note || null}
        description={null}
      />
    </div>
  );
}
