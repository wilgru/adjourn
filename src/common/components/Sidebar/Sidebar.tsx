import * as Dialog from "@radix-ui/react-dialog";
import { useSetAtom } from "jotai";
import { colours } from "src/colours/colours.constant";
import { isSideBarVisibleAtom } from "src/common/atoms/isSidebarVisibleAtom";
import { Button } from "src/common/components/Button/Button";
import { NavItem } from "src/common/components/NavItem/NavItem";
import { getNavigationDay } from "src/common/utils/getNavigationDay";
import { JournalSelector } from "src/journals/components/JournalSelector/JouranlSelector";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { useGetJournals } from "src/journals/hooks/useGetJournals";
import { CreateTagGroupModal } from "src/tags/components/CreateTagGroupModal/CreateTagGroupModal";
import { useGetTagGroups } from "src/tags/hooks/useGetTagGroups";
import { SidebarTagSection } from "./SidebarTagSection";

export const Sidebar = () => {
  const { journalId } = useCurrentJournalId();
  const { ungroupedTags, tagGroups } = useGetTagGroups();
  const { journals } = useGetJournals();

  const currentJournal = journals.find((journal) => journal.id === journalId);

  const setIsSidebarVisible = useSetAtom(isSideBarVisibleAtom);

  if (!journalId || !currentJournal) {
    return <div>Error trying to load journal...</div>; // TODO: handle this better, use a loading state or a message indicating no journal is selected
  }

  return (
    <aside className="p-3 bg-slate-50 min-w-60">
      <div className="flex flex-col flex-shrink-0 justify-between gap-3 h-full">
        <div className="flex flex-col gap-3 justify-between overflow-y-auto">
          <div className="flex flex-row items-center justify-between gap-2">
            <h1 className="font-title text-slate-500 text-xl">Adjourn</h1>

            <Button
              variant="ghost"
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
              colour={colours.grey}
            />

            <NavItem
              ghost
              iconName="checkCircle"
              title="Tasks"
              to={`/${journalId}/tasks/`}
              colour={colours.grey}
            />

            <NavItem
              ghost
              iconName="chatCenteredText"
              title="Updates"
              to={`/${journalId}/logbook/${getNavigationDay()}`}
              colour={colours.grey}
            />

            <NavItem
              ghost
              iconName="bookmark"
              title={"Bookmarked"}
              to={`/${journalId}/bookmarked/`}
              colour={colours.red}
            />
          </section>

          <SidebarTagSection title={"Tags"}>
            {ungroupedTags.map((tag) => (
              <NavItem
                iconName={tag.icon}
                colour={tag.colour}
                title={tag.name}
                preview={tag.noteCount}
                to={`/${journalId}/tags/${tag.id}`}
              />
            ))}
          </SidebarTagSection>

          {tagGroups.map((tagGroup) => (
            <SidebarTagSection
              title={tagGroup.title}
              tagGroup={tagGroup}
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
                  />
                ))}
              </div>
            </SidebarTagSection>
          ))}

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                className="mt-1"
                variant="ghost-strong"
                size="sm"
                iconName="plus"
              >
                Add section
              </Button>
            </Dialog.Trigger>

            <CreateTagGroupModal />
          </Dialog.Root>
        </div>
      </div>
    </aside>
  );
};
