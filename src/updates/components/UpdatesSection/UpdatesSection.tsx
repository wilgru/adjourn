import { UpdateEditor } from "src/updates/components/UpdateEditor/UpdateEditor";
import type { Colour } from "src/colours/Colour.type";
import type { UpdatesGroup } from "src/updates/Update.type";

type UpdatesSectionProps = {
  group: UpdatesGroup;
  colour: Colour;
};

export const UpdatesSection = ({ group, colour }: UpdatesSectionProps) => {
  return (
    <section id={group.title}>
      <h2 className="font-title text-3xl mb-4">{group.title}</h2>

      <div className="flex flex-col gap-3 relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 ml-2" />

        <div className="flex flex-col gap-3 pl-6">
          {group.updates.map((upd) => (
            <UpdateEditor key={upd.id} update={upd} colour={colour} />
          ))}
        </div>
      </div>
    </section>
  );
};
