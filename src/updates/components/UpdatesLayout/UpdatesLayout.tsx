import { useMemo, useState } from "react";
import { colours } from "src/colours/colours.constant";
import { PageHeader } from "src/common/components/PageHeader/PageHeader";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import TableOfContents from "src/tableOfContents/TableOfContents/TableOfContents";
import { UpdateEditor } from "src/updates/components/UpdateEditor/UpdateEditor";
import { UpdatesSection } from "src/updates/components/UpdatesSection/UpdatesSection";
import { groupUpdates } from "src/updates/utils/groupUpdates";
import type { Colour } from "src/colours/Colour.type";
import type { Update } from "src/updates/Update.type";

type UpdatesLayoutProps = {
  updates: Update[];
  colour?: Colour;
  pendingNew?: boolean;
  onCancelNew?: () => void;
};

export const UpdatesLayout = ({
  updates,
  colour = colours.orange,
  pendingNew = false,
  onCancelNew,
}: UpdatesLayoutProps) => {
  const [navigationId, setNavigationId] = useState("");

  const groupedUpdates = groupUpdates(updates);

  const secondaryBadges = useMemo(
    () => [`${updates.length} updates`],
    [updates.length],
  );

  const tableOfContentItems = useMemo(
    () =>
      groupedUpdates.map((group) => ({
        title: group.title,
        navigationId: group.title,
      })),
    [groupedUpdates],
  );

  return (
    <div className="h-full max-w-[1000px] w-full min-w-0 pb-16 flex items-center">
      <div className="h-full w-full p-12 flex flex-col gap-14 overflow-y-scroll">
        <PageHeader colour={colour} secondaryBadges={secondaryBadges}>
          <div className="flex gap-3 items-end">
            <Icon
              className={cn("pb-1", colour.text)}
              iconName="chatCenteredText"
              size="xl"
            />
            <h1 className="font-title text-5xl">Updates</h1>
          </div>
        </PageHeader>

        {pendingNew && (
          <div className="flex flex-col">
            <UpdateEditor
              update={{ notes: [], tint: null }}
              colour={colour}
              onCancel={onCancelNew}
            />
          </div>
        )}

        {groupedUpdates.length === 0 && !pendingNew && (
          <div className="w-full p-6 flex flex-col gap-3 items-center rounded-2xl bg-slate-50">
            <p className="text-slate-500">No updates yet</p>
          </div>
        )}

        {groupedUpdates.map((group) => (
          <UpdatesSection key={group.title} group={group} colour={colour} />
        ))}
      </div>

      <div className="flex flex-col justify-center">
        <TableOfContents
          title="Updates"
          items={tableOfContentItems}
          colour={colour}
          activeItemNavigationId={navigationId}
          onJumpTo={(id) => setNavigationId(id)}
        />
      </div>
    </div>
  );
};
