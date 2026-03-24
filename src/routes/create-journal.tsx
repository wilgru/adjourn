import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { colours } from "src/colours/colours.constant";
import { ColourPicker } from "src/colours/components/ColourPicker/ColourPicker";
import { Button } from "src/common/components/Button/Button";
import { Input } from "src/common/components/Input/Input";
import IconPicker from "src/icons/components/IconPicker/IconPicker";
import { useCreateJournal } from "src/journals/hooks/useCreateJournal";
import type { Colour } from "src/colours/Colour.type";

export const Route = createFileRoute("/create-journal")({
  component: RouteComponent,
});

type JournalToCreate = {
  title: string;
  icon: string;
  colour: Colour;
};

function RouteComponent() {
  const { createJournal, isCreatingJournal } = useCreateJournal();
  const navigate = useNavigate();
  const [journalToCreate, setJournalToCreate] = useState<JournalToCreate>({
    title: "",
    icon: "notebook",
    colour: colours.blue,
  });

  const onClickCreate = async () => {
    const createdJournal = await createJournal({
      createJournalData: {
        title: journalToCreate.title,
        icon: journalToCreate.icon,
        colour: journalToCreate.colour,
      },
    });

    if (!createdJournal) {
      return;
    }

    navigate({ to: `/${createdJournal.id}/notes` });
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center h-screen w-screen bg-slate-100">
      <div className="flex flex-col gap-6 p-6 border bg-white border-slate-300 rounded-lg max-w-sm w-full drop-shadow">
        <h1 className="text-4xl font-normal font-title tracking-tight ">
          New Journal
        </h1>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium leading-6">Title</label>
            <div>
              <Input
                onChange={(e) =>
                  setJournalToCreate((currentJournalToCreate) => {
                    return { ...currentJournalToCreate, title: e.target.value };
                  })
                }
                id="title"
                type="text"
                value={journalToCreate.title}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium leading-6 ">Icon</label>
            <div>
              <IconPicker
                onSelectIcon={(iconName: string) => {
                  setJournalToCreate((currentJournalToCreate) => {
                    return { ...currentJournalToCreate, icon: iconName };
                  });
                }}
                selectedIconName={journalToCreate.icon}
                colour={journalToCreate.colour}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium leading-6 ">Colour</label>
            <div>
              <ColourPicker
                onSelectColour={(colour: Colour) => {
                  setJournalToCreate((currentJournalToCreate) => {
                    return { ...currentJournalToCreate, colour: colour };
                  });
                }}
                selectedColourName={journalToCreate.colour.name}
              />
            </div>
          </div>
          <div>
            <Button disabled={isCreatingJournal} onClick={onClickCreate}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
