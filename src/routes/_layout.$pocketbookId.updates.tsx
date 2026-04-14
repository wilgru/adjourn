import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import requireClientAuth from "src/Users/utils/requireClientAuth";
import { Button } from "src/common/components/Button/Button";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { useCurrentPocketbook } from "src/pocketbooks/hooks/useCurrentPocketbook";
import { UpdatesLayout } from "src/updates/components/UpdatesLayout/UpdatesLayout";
import { useGetUpdates } from "src/updates/hooks/useGetUpdates";

export const Route = createFileRoute("/_layout/$pocketbookId/updates")({
  component: UpdatesComponent,
  beforeLoad: async ({ location }) => {
    requireClientAuth(location);
  },
});

function UpdatesComponent() {
  const { currentPocketbook } = useCurrentPocketbook();
  const { updates } = useGetUpdates();
  const [pendingNew, setPendingNew] = useState(false);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="chatCenteredText"
        title="Updates"
        colour={currentPocketbook?.colour}
      >
        <Button
          variant="ghost"
          size="sm"
          colour={currentPocketbook?.colour}
          iconName="plus"
          onClick={() => setPendingNew(true)}
        />
      </Toolbar>

      <UpdatesLayout
        updates={updates}
        colour={currentPocketbook?.colour}
        pendingNew={pendingNew}
        onCreateNew={() => setPendingNew(true)}
        onCancelNew={() => setPendingNew(false)}
      />
    </div>
  );
}
