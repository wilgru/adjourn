import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "src/common/components/Button/Button";
import { cn } from "src/common/utils/cn";
import { getNavigationDay } from "src/common/utils/getNavigationDay";
import { Icon } from "src/icons/components/Icon/Icon";
import { JournalSettingsModal } from "src/journals/components/JournalSettingsModal/JournalSettingsModal";
import type { Journal } from "src/journals/Journal.type";

type JournalSelectorProps = {
  currentJournal: Journal;
  journals: Journal[];
};

const getJournalSummary = (journal: Journal): string => {
  const taskCount = journal.taskCount ?? 0;
  const noteCount = journal.noteCount ?? 0;

  if (taskCount === 0 && noteCount === 0) {
    return "No content";
  }

  const parts: string[] = [];
  if (taskCount > 0) {
    parts.push(`${taskCount} task${taskCount === 1 ? "" : "s"}`);
  }
  if (noteCount > 0) {
    parts.push(`${noteCount} note${noteCount === 1 ? "" : "s"}`);
  }

  return parts.join(", ");
};

export const JournalSelector = ({
  currentJournal,
  journals,
}: JournalSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex gap-2 justify-between border border-slate-300 rounded-2xl p-1.5 relative",
        `hover:${currentJournal.colour.backgroundPill}`,
      )}
    >
      <DropdownMenu.Root open={isOpen}>
        <DropdownMenu.Trigger>
          <button
            className="flex items-center gap-2 w-full h-full"
            onClick={() => setIsOpen(true)}
          >
            <Icon
              iconName={currentJournal.icon}
              className={cn(
                "w-8 h-8 p-1.5 rounded-lg",
                currentJournal.colour.textPill,
                currentJournal.colour.backgroundPill,
              )}
            />

            <div className="flex flex-col items-start">
              <h2 className="text-sm">{currentJournal.title}</h2>
              <p className="text-xs text-slate-400">
                {getJournalSummary(currentJournal)}
              </p>
            </div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={-45}
            alignOffset={-7}
            onInteractOutside={() => setIsOpen(false)}
            onCloseAutoFocus={() => setIsOpen(false)}
            onEscapeKeyDown={() => setIsOpen(false)}
            align="start"
            className="w-56 flex flex-col flex-grow gap-2 bg-white border border-slate-200 rounded-2xl p-2 drop-shadow"
          >
            <DropdownMenu.Label className="pl-2 text-xs text-slate-400">
              Journals
            </DropdownMenu.Label>

            {journals.map((journal) => (
              <DropdownMenu.Item key={journal.id}>
                <Link
                  to="/$journalId/logbook/$dateString"
                  params={{
                    journalId: journal.id,
                    dateString: getNavigationDay(),
                  }}
                  onClick={() => {
                    localStorage.setItem("lastUsedJournalId", journal.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 leading-none text-sm p-2 outline-none rounded-xl cursor-pointer transition-colors",
                    currentJournal.id === journal.id
                      ? journal.colour.backgroundPill
                      : `hover:${journal.colour.backgroundPill}`,
                  )}
                >
                  <Icon
                    iconName={journal.icon}
                    className={cn(
                      "w-8 h-8 p-1.5 rounded-lg",
                      journal.colour.textPill,
                      journal.colour.backgroundPill,
                    )}
                  />

                  <div className="flex flex-col items-start">
                    <h2 className="text-sm">{journal.title}</h2>
                    <p className="text-xs text-slate-400">
                      {getJournalSummary(journal)}
                    </p>
                  </div>
                </Link>
              </DropdownMenu.Item>
            ))}

            <DropdownMenu.Separator className="my-1 border-t border-slate-200" />

            <DropdownMenu.Item className="flex items-center gap-2 leading-none text-sm p-2 outline-none rounded-xl cursor-pointer data-[highlighted]:bg-orange-100 data-[highlighted]:text-orange-500 transition-colors">
              <Link to={"/create-journal"} className="flex items-center gap-2">
                <Icon iconName="plus" size="sm" className="text-slate-500" />
                Create new journal
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="ghost" size="sm" iconName="gear" />
        </Dialog.Trigger>

        <JournalSettingsModal journal={currentJournal} />
      </Dialog.Root>
    </div>
  );
};
