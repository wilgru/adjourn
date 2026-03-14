import { useState, useMemo, Fragment } from "react";
import { colours } from "src/colours/colours.constant";
import { EmptyState } from "src/common/components/EmptyState/EmptyState";
import { PageHeader } from "src/common/components/PageHeader/PageHeader";
import TableOfContents from "src/tableOfContents/TableOfContents/TableOfContents";
import { groupTasks } from "src/tasks/utils/groupTasks";
import { TasksSection } from "../TasksSection/TasksSection";
import type { Colour } from "src/colours/Colour.type";
import type { Task } from "src/tasks/Task.type";

export type TasksLayoutSection<T> = {
  title: string;
  prefillNewData?: Partial<T>;
  children: React.ReactNode;
};

type TasksLayoutProps = {
  header: React.ReactNode;
  title: string;
  colour?: Colour;
  showNoteCreateTimeOnly?: boolean;
  description?: string;
  tasks: Task[];
};

export const TasksLayout = ({
  header,
  title,
  colour = colours.orange,
  description,
  tasks,
}: TasksLayoutProps) => {
  const [navigationId, setNavigationId] = useState("");

  const groupedTasks = groupTasks(tasks, "note");

  const tableOfContentItems = useMemo(() => {
    const noteTOCItems = groupedTasks.map((group) => {
      return {
        title: group.title,
        navigationId: group.relevantTaskData.note?.id ?? "no-note",
      };
    });

    return noteTOCItems;
  }, [groupedTasks]);

  // FIXME: pb-16 is the height of the toolbar to fix issue with scrolling body getting cut off. Issue to do with not having a fixed height on consuming element and children elements before this one pushing this one down.
  return (
    <div className="h-full max-w-[1000px] w-full min-w-0 pb-16 flex items-center">
      <div className="h-full w-full p-12 flex flex-col gap-6 overflow-y-scroll">
        <PageHeader colour={colour} description={description}>
          {header}
        </PageHeader>

        {groupedTasks.length === 0 && (
          <EmptyState
            title="No tasks yet"
            description="Add your first task to start tracking what matters."
            colour={colour}
            iconName="checkCircle"
          />
        )}

        {groupedTasks.map((group, index) => (
          <Fragment key={group.relevantTaskData.note?.id ?? "no-note"}>
            {index > 0 && <hr className="border-slate-200" />}
            <TasksSection taskGroup={group} colour={colour} />
          </Fragment>
        ))}
      </div>

      {tableOfContentItems.length > 0 && (
        <div className="flex flex-col justify-center">
          <TableOfContents
            title={title}
            items={tableOfContentItems}
            colour={colour}
            activeItemNavigationId={navigationId}
            onJumpTo={(id) => setNavigationId(id)}
          />
        </div>
      )}
    </div>
  );
};
