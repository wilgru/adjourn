import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "src/common/components/Button/Button";
import { useCurrentPocketbookId } from "src/pocketbooks/hooks/useCurrentPocketbookId";
import { TaskEditor } from "src/tasks/components/TaskEditor/TaskEditor";
import type { Colour } from "src/colours/Colour.type";
import type { TasksGroup } from "src/tasks/Task.type";

type TasksSectionProps = {
  taskGroup: TasksGroup;
  colour: Colour;
  /** Incrementing this counter causes the section to open a new task editor. Used by the toolbar plus button. */
  noNoteEditorTrigger?: number;
};

export const TasksSection = ({
  taskGroup,
  colour,
  noNoteEditorTrigger,
}: TasksSectionProps) => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { pocketbookId } = useCurrentPocketbookId();

  // Open the new-task editor whenever the toolbar plus button fires.
  useEffect(() => {
    if (noNoteEditorTrigger && noNoteEditorTrigger > 0) {
      setIsAddingTask(true);
    }
  }, [noNoteEditorTrigger]);

  const note = taskGroup.relevantTaskData.note;
  const isNoNote = !note;

  if (isNoNote) {
    return (
      <section id="no-note">
        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50">
          <div
            className="flex gap-2 items-center"
            onMouseOver={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            <p className="text-lg text-slate-400 font-title">
              {taskGroup.title}
            </p>

            {isTitleHovered && (
              <Button
                variant="ghost-strong"
                size="sm"
                iconName="plus"
                colour={colour}
                onClick={() => setIsAddingTask(true)}
              />
            )}
          </div>

          {taskGroup.tasks.length === 0 && !isAddingTask && (
            <div className="w-full p-3 flex flex-col gap-3 items-center">
              <p className="text-slate-500">No task yet</p>

              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  iconName="plusSquare"
                  onClick={() => setIsAddingTask(true)}
                >
                  Create your first task
                </Button>
              </div>
            </div>
          )}

          {taskGroup.tasks.map((task) => (
            <TaskEditor key={task.id} task={task} onSave={() => {}} />
          ))}

          {isAddingTask && (
            <TaskEditor
              task={{ note: null }}
              onSave={() => setIsAddingTask(false)}
            />
          )}
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

        {isTitleHovered && (
          <div className="mb-2 flex gap-1">
            <Button
              variant="ghost-strong"
              size="sm"
              iconName="plus"
              colour={colour}
              onClick={() => setIsAddingTask(true)}
            />

            {pocketbookId && (
              <Link
                to="/$pocketbookId/notes"
                params={{ pocketbookId }}
                search={{ noteId: note.id }}
              >
                <Button
                  variant="ghost-strong"
                  size="sm"
                  iconName="arrowCircleRight"
                  colour={colour}
                />
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-1">
        {taskGroup.tasks.map((task) => (
          <TaskEditor key={task.id} task={task} onSave={() => {}} />
        ))}

        {isAddingTask && (
          <TaskEditor task={{ note }} onSave={() => setIsAddingTask(false)} />
        )}
      </div>
    </section>
  );
};
