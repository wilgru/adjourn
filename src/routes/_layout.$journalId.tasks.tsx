import { createFileRoute, redirect } from "@tanstack/react-router";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import { colours } from "src/colours/colours.constant";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import { useCurrentJournal } from "src/journals/hooks/useCurrentJournal";
import { TasksLayout } from "src/tasks/components/TasksLayout/TasksLayout";
import { useGetTasks } from "src/tasks/hooks/useGetTasks";

export const Route = createFileRoute("/_layout/$journalId/tasks")({
  component: RouteComponent,
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

function RouteComponent() {
  const { currentJournal } = useCurrentJournal();
  const colour = currentJournal?.colour ?? colours.orange;

  const { tasks } = useGetTasks({});

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="listChecks" title="Tasks" colour={colour} />

      <TasksLayout
        header={
          <div className="flex gap-3">
            <Icon
              className={cn("pb-1", colour.text)}
              iconName="listChecks"
              size="xl"
            />

            <h1 className="font-title text-5xl">Tasks</h1>
          </div>
        }
        title="Tasks"
        tasks={tasks}
        colour={colour}
      />
    </div>
  );
}
