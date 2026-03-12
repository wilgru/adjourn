import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { colours } from "src/colours/colours.constant";
import { ColourPicker } from "src/colours/components/ColourPicker/ColourPicker";
import { Button } from "src/common/components/Button/Button";
import { Input } from "src/common/components/Input/Input";
import { Label } from "src/common/components/Label/Label";
import IconPicker from "src/icons/components/IconPicker/IconPicker";
import { useUpdateJournal } from "src/journals/hooks/useUpdateJournal";
import type { Journal } from "src/journals/Journal.type";

type JournalSettingsModalProps = {
  journal: Journal;
};

export const JournalSettingsModal = ({ journal }: JournalSettingsModalProps) => {
  const [editedJournal, setEditedJournal] = useState(journal);
  const { updateJournal, isUpdatingJournal } = useUpdateJournal();

  // TODO: find better solution than using useEffect
  useEffect(() => {
    setEditedJournal(journal);
  }, [journal]);

  const onSaveEdit = async () => {
    await updateJournal({
      journalId: journal.id,
      updateJournalData: {
        title: editedJournal.title,
        icon: editedJournal.icon,
        colour: editedJournal.colour,
      },
    });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black opacity-25 fixed inset-0 data-[state=open]:animate-overlayShow" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll p-4 focus:outline-none bg-white border border-slate-300 rounded-2xl shadow-2xl data-[state=open]:animate-contentShow">
        <Dialog.Title className="mb-5">Journal settings</Dialog.Title>

        <div className="flex flex-col gap-3">
          <div>
            <Label title="Title" />
            <Input
              size="md"
              id={journal.id}
              value={editedJournal.title}
              onChange={(e) =>
                setEditedJournal((current) => ({
                  ...current,
                  title: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label title="Colour" />
            <ColourPicker
              selectedColourName={editedJournal.colour.name}
              onSelectColour={(colour) =>
                setEditedJournal((current) => ({ ...current, colour }))
              }
            />
          </div>

          <div>
            <Label title="Icon" />
            <IconPicker
              selectedIconName={editedJournal.icon}
              colour={editedJournal.colour}
              onSelectIcon={(iconName) =>
                setEditedJournal((current) => ({ ...current, icon: iconName }))
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
                disabled={isUpdatingJournal}
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
