import { Button } from "src/common/components/Button/Button";
import { Input } from "../../../common/components/Input/Input";
import type { TagLink } from "src/tags/Tag.type";

type MultiLinkInputProps = {
  links: TagLink[];
  onChange: (link: TagLink) => void;
  onAddLink: () => void;
};

export const MultiLinkInput = ({
  links,
  onChange,
  onAddLink,
}: MultiLinkInputProps) => {
  return (
    <div className="flex flex-col gap-3 p-2 bg-slate-100 rounded-md">
      {links.map((link) => (
        <div key={link.id} className="flex gap-2">
          <Input
            id={`${link.id}-link`}
            type="url"
            value={link.link}
            placeholder="URL"
            required
            onChange={(e) => onChange({ ...link, link: e.target.value })}
          />

          <Input
            id={link.id}
            type="text"
            value={link.title || ""}
            placeholder="Display text (optional)"
            onChange={(e) =>
              onChange({ ...link, title: e.target.value || undefined })
            }
          />
        </div>
      ))}

      <Button size="sm" iconName="plus" variant="ghost" onClick={onAddLink}>
        Add link
      </Button>
    </div>
  );
};
