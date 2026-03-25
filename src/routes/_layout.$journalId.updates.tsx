import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import requireClientAuth from "src/Users/utils/requireClientAuth";
import { Button } from "src/common/components/Button/Button";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { useCurrentJournal } from "src/journals/hooks/useCurrentJournal";
import { UpdatesLayout } from "src/updates/components/UpdatesLayout/UpdatesLayout";
import { useGetUpdates } from "src/updates/hooks/useGetUpdates";

export const Route = createFileRoute("/_layout/$journalId/updates")({
  component: UpdatesComponent,
  beforeLoad: async ({ location }) => {
    requireClientAuth(location);
  },
});

function UpdatesComponent() {
  const { currentJournal } = useCurrentJournal();
  const { updates } = useGetUpdates();
  const [pendingNew, setPendingNew] = useState(false);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="chatCenteredText"
        title="Updates"
        colour={currentJournal?.colour}
      >
        <Button
          variant="ghost"
          size="sm"
          colour={currentJournal?.colour}
          iconName="plus"
          onClick={() => setPendingNew(true)}
        />
      </Toolbar>

      <UpdatesLayout
        updates={updates}
        colour={currentJournal?.colour}
        pendingNew={pendingNew}
        onCreateNew={() => setPendingNew(true)}
        onCancelNew={() => setPendingNew(false)}
      />
    </div>
  );
}
