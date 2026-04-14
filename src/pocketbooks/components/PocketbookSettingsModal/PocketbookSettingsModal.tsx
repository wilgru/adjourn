import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { colours } from "src/colours/colours.constant";
import { ColourPicker } from "src/colours/components/ColourPicker/ColourPicker";
import { Button } from "src/common/components/Button/Button";
import { Input } from "src/common/components/Input/Input";
import { Label } from "src/common/components/Label/Label";
import IconPicker from "src/icons/components/IconPicker/IconPicker";
import { useUpdatePocketbook } from "src/pocketbooks/hooks/useUpdatePocketbook";
import type { Pocketbook } from "src/pocketbooks/Pocketbook.type";

type PocketbookSettingsModalProps = {
  pocketbook: Pocketbook;
};

export const PocketbookSettingsModal = ({
  pocketbook,
}: PocketbookSettingsModalProps) => {
  const [editedPocketbook, setEditedPocketbook] = useState(pocketbook);
  const { updatePocketbook, isUpdatingPocketbook } = useUpdatePocketbook();

  // TODO: find better solution than using useEffect
  useEffect(() => {
    setEditedPocketbook(pocketbook);
  }, [pocketbook]);

  const onSaveEdit = async () => {
    await updatePocketbook({
      pocketbookId: pocketbook.id,
      updatePocketbookData: {
        title: editedPocketbook.title,
        icon: editedPocketbook.icon,
        colour: editedPocketbook.colour,
      },
    });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black opacity-25 fixed inset-0 data-[state=open]:animate-overlayShow" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll p-4 focus:outline-none bg-white border border-slate-300 rounded-2xl shadow-2xl data-[state=open]:animate-contentShow">
        <Dialog.Title className="mb-5">Pocketbook settings</Dialog.Title>

        <div className="flex flex-col gap-3">
          <div>
            <Label title="Title" />
            <Input
              size="md"
              id={pocketbook.id}
              value={editedPocketbook.title}
              onChange={(e) =>
                setEditedPocketbook((current) => ({
                  ...current,
                  title: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label title="Colour" />
            <ColourPicker
              selectedColourName={editedPocketbook.colour.name}
              onSelectColour={(colour) =>
                setEditedPocketbook((current) => ({ ...current, colour }))
              }
            />
          </div>

          <div>
            <Label title="Icon" />
            <IconPicker
              selectedIconName={editedPocketbook.icon}
              colour={editedPocketbook.colour}
              onSelectIcon={(iconName) =>
                setEditedPocketbook((current) => ({ ...current, icon: iconName }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button aria-label="Close" size="sm" variant="ghost">
                Discard
              </Button>
            </Dialog.Close>

            <Dialog.Close asChild>
              <Button
                aria-label="Confirm"
                colour={colours.green}
                size="sm"
                disabled={isUpdatingPocketbook}
                onClick={onSaveEdit}
              >
                Save
              </Button>
            </Dialog.Close>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
