import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "src/common/components/Button/Button";
import { CreateTagModal } from "src/tags/components/CreateTagModal/CreateTagModal";
import { DeleteTagGroupModal } from "src/tags/components/DeleteTagGroupModal/DeleteTagGroupModal";
import type { TagGroup } from "src/tags/Tag.type";

export const SidebarTagSection = ({
  title,
  tagGroup,
  children,
}: {
  title: string;
  tagGroup?: TagGroup;
  children: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="flex flex-col gap-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div className="flex flex-row items-center gap-1">
          <h1 className="font-title text-slate-400 text-md">{title}</h1>

          <Dialog.Root>
            {isHovered && (
              <Dialog.Trigger asChild>
                <Button
                  className="mb-1"
                  variant="ghost-strong"
                  size="xs"
                  iconName="plus"
                />
              </Dialog.Trigger>
            )}

            <CreateTagModal tagGroupId={tagGroup?.id} />
          </Dialog.Root>

          {tagGroup && (
            <Dialog.Root>
              {isHovered && (
                <Dialog.Trigger asChild>
                  <Button
                    className="mb-1"
                    variant="ghost-strong"
                    size="xs"
                    iconName="trash"
                  />
                </Dialog.Trigger>
              )}

              <DeleteTagGroupModal tagGroup={tagGroup} />
            </Dialog.Root>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};
