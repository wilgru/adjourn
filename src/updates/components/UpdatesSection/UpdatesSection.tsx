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

      <div className="flex flex-col relative">
        {group.updates.map((upd) => (
          <UpdateEditor key={upd.id} update={upd} colour={colour} />
        ))}
      </div>
    </section>
  );
};
