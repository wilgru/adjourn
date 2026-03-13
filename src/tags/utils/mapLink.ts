import type { RecordModel } from "pocketbase";
import type { TagLink } from "src/tags/Tag.type";

export const mapLink = (link: RecordModel): TagLink => {
  return {
    id: link.id,
    title: link.title || undefined,
    link: link.link,
  };
};
