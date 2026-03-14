import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "src/common/components/Button/Button";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { TaskEditor } from "src/tasks/components/TaskEditor/TaskEditor";
import type { Colour } from "src/colours/Colour.type";
import type { TasksGroup } from "src/tasks/Task.type";

type TasksSectionProps = {
  taskGroup: TasksGroup;
  colour: Colour;
};

export const TasksSection = ({ taskGroup, colour }: TasksSectionProps) => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const { journalId } = useCurrentJournalId();

  const note = taskGroup.relevantTaskData.note;
  const isNoNote = !note;

  if (isNoNote) {
    return (
      <section id="no-note">
        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50">
          <p className="text-lg text-slate-400 font-title">{taskGroup.title}</p>

          {taskGroup.tasks.length === 0 && (
            <div className="w-full p-3 flex flex-col gap-3 items-center">
              <p className="text-slate-500">No task yet</p>

              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  iconName="plusSquare"
                  onClick={() => {}}
                >
                  Create your first task
                </Button>
              </div>
            </div>
          )}

          {taskGroup.tasks.map((task) => (
            <TaskEditor key={task.id} task={task} onSave={() => {}} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={note.id}>
      <div
        className="flex p-2 gap-2 items-center"
        onMouseOver={() => setIsTitleHovered(true)}
        onMouseLeave={() => setIsTitleHovered(false)}
      >
        <h2 className="font-title text-3xl">{taskGroup.title}</h2>

        {isTitleHovered && journalId && (
          <div className="mb-2">
            <Link
              to="/$journalId/notes"
              params={{ journalId }}
              search={{ noteId: note.id }}
            >
              <Button
                variant="ghost-strong"
                size="sm"
                iconName="arrowCircleRight"
                colour={colour}
              />
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-1">
        {taskGroup.tasks.map((task) => (
          <TaskEditor key={task.id} task={task} onSave={() => {}} />
        ))}
      </div>
    </section>
  );
};
