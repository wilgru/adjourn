import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
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
  const [pendingNew, setPendingNew] = useState(false);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="chatCenteredText" title="Updates" colour={colour}>
        <Button
          variant="ghost"
          size="sm"
          colour={colour}
          iconName="plus"
          onClick={() => setPendingNew(true)}
        />
      </Toolbar>

      <UpdatesLayout
        updates={updates}
        colour={colour}
        pendingNew={pendingNew}
        onCancelNew={() => setPendingNew(false)}
      />
    </div>
  );
}
