import * as Dialog from "@radix-ui/react-dialog";
import { useSetAtom } from "jotai";
import { colours } from "src/colours/colours.constant";
import { isSideBarVisibleAtom } from "src/common/atoms/isSidebarVisibleAtom";
import { Button } from "src/common/components/Button/Button";
import { NavItem } from "src/common/components/NavItem/NavItem";
import { useElectronEnvironment } from "src/common/hooks/useElectronEnvironment";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import { JournalSelector } from "src/journals/components/JournalSelector/JouranlSelector";
import { useCurrentJournal } from "src/journals/hooks/useCurrentJournal";
import { useGetJournalContentCounts } from "src/journals/hooks/useGetJournalContentCounts";
import { CreateTagGroupModal } from "src/tags/components/CreateTagGroupModal/CreateTagGroupModal";
import { useGetTagGroups } from "src/tags/hooks/useGetTagGroups";
import { SidebarTagSection } from "./SidebarTagSection";

export const Sidebar = () => {
  const { isElectron, isMacElectron } = useElectronEnvironment();

  const { journalId, currentJournal, journals, isFetchingJournals } =
    useCurrentJournal();
  const { ungroupedTags, tagGroups } = useGetTagGroups();
  const { counts } = useGetJournalContentCounts();

  const setIsSidebarVisible = useSetAtom(isSideBarVisibleAtom);

  if (isFetchingJournals) {
    return null;
  }

  if (!journalId || !currentJournal) {
    return null;
  }

  return (
    <aside className="p-3 bg-slate-50 min-w-60">
      <div className="flex flex-col flex-shrink-0 justify-between gap-3 h-full">
        <div className="flex flex-col gap-3 justify-between overflow-y-auto">
          <div
            className={cn(
              "flex flex-row items-center gap-2",
              isElectron ? "justify-end" : "justify-between",
              isMacElectron ? "electron-drag-region min-h-8" : "",
            )}
          >
            {!isElectron && (
              <h1 className="font-title text-slate-500 text-xl">Adjourn</h1>
            )}

            <Button
              className={isMacElectron ? "electron-no-drag" : ""}
              variant="ghost"
              size="sm"
              colour={currentJournal.colour}
              onClick={() => setIsSidebarVisible(false)}
              iconName="arrowLineLeft"
            />
          </div>

          <JournalSelector
            currentJournal={currentJournal}
            journals={journals}
          />

          <section className="flex flex-col gap-1">
            <NavItem
              ghost
              iconName="pencil"
              title="Notes"
              to={`/${journalId}/notes/`}
              colour={currentJournal.colour}
              preview={counts?.noteCount}
            />

            <NavItem
              ghost
              iconName="checkCircle"
              title="Tasks"
              to={`/${journalId}/tasks/`}
              colour={currentJournal.colour}
              preview={counts?.taskCount}
            />

            <NavItem
              ghost
              iconName="chatCenteredText"
              title="Updates"
              to={`/${journalId}/updates`}
              colour={currentJournal.colour}
              preview={counts?.updateCount}
            />

            <NavItem
              ghost
              iconName="bookmark"
              title={"Bookmarked"}
              to={`/${journalId}/bookmarked/`}
              colour={colours.red}
              preview={counts?.bookmarkedCount}
            />
          </section>

          <SidebarTagSection
            title={"Tags"}
            colour={currentJournal.colour}
            isEmpty={ungroupedTags.length === 0}
          >
            {ungroupedTags.map((tag) => (
              <NavItem
                colour={tag.colour}
                title={tag.name}
                preview={tag.noteCount}
                to={`/${journalId}/tags/${tag.id}`}
                key={tag.id}
                iconName={tag.icon}
              />
            ))}
          </SidebarTagSection>

          {tagGroups.map((tagGroup) => (
            <SidebarTagSection
              title={tagGroup.title}
              tagGroup={tagGroup}
              colour={currentJournal.colour}
              isEmpty={tagGroup.tags.length === 0}
              key={tagGroup.id}
            >
              <div className="flex flex-col gap-1 mt-1">
                {tagGroup.tags.map((tag) => (
                  <NavItem
                    iconName={tag.icon}
                    colour={tag.colour}
                    title={tag.name}
                    preview={tag.noteCount}
                    to={`/${journalId}/tags/${tag.id}`}
                    key={tag.id}
                  />
                ))}
              </div>
            </SidebarTagSection>
          ))}

          {/* <hr className="w-full border-slate-200" /> */}

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className={cn(
                  "mt-1 w-fit flex items-center gap-1 text-slate-400 transition-colors",
                  `hover:${currentJournal.colour.textPill}`,
                )}
              >
                <span className="font-title text-md">Add Section</span>
                <Icon iconName="plusSquare" size="sm" className="pb-1" />
              </button>
            </Dialog.Trigger>

            <CreateTagGroupModal />
          </Dialog.Root>
        </div>
      </div>
    </aside>
  );
};
