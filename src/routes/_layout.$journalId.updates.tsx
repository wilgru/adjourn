import { createFileRoute, redirect } from "@tanstack/react-router";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import { colours } from "src/colours/colours.constant";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { useCurrentJournal } from "src/journals/hooks/useCurrentJournal";
import { UpdatesLayout } from "src/updates/components/UpdatesLayout/UpdatesLayout";
import { useGetUpdates } from "src/updates/hooks/useGetUpdates";

export const Route = createFileRoute("/_layout/$journalId/updates")({
  component: UpdatesComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function UpdatesComponent() {
  const { currentJournal } = useCurrentJournal();
  const colour = currentJournal?.colour ?? colours.orange;
  const { updates } = useGetUpdates();

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="chatCenteredText" title="Updates" colour={colour} />

      <UpdatesLayout updates={updates} colour={colour} />
    </div>
  );
}
