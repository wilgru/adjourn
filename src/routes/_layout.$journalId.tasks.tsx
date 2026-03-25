import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import requireClientAuth from "src/Users/utils/requireClientAuth";
import { Button } from "src/common/components/Button/Button";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import { useCurrentJournal } from "src/journals/hooks/useCurrentJournal";
import { TasksLayout } from "src/tasks/components/TasksLayout/TasksLayout";
import { useGetTasks } from "src/tasks/hooks/useGetTasks";

export const Route = createFileRoute("/_layout/$journalId/tasks")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    requireClientAuth(location);
  },
});

function RouteComponent() {
  const { currentJournal } = useCurrentJournal();

  const { tasks } = useGetTasks({});
  const [noNoteEditorTrigger, setNoNoteEditorTrigger] = useState(0);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="checkCircle"
        title="Tasks"
        colour={currentJournal?.colour}
        journalColour={currentJournal?.colour}
      >
        <Button
          variant="ghost"
          size="sm"
          colour={currentJournal?.colour}
          iconName="plus"
          onClick={() => setNoNoteEditorTrigger((c) => c + 1)}
        />
      </Toolbar>

      <TasksLayout
        header={
          <div className="flex gap-3">
            <Icon
              className={cn("pb-1", currentJournal?.colour?.text)}
              iconName="checkCircle"
              size="xl"
            />

            <h1 className="font-title text-5xl">Tasks</h1>
          </div>
        }
        title="Tasks"
        tasks={tasks}
        colour={currentJournal?.colour}
        noNoteEditorTrigger={noNoteEditorTrigger}
      />
    </div>
  );
}
