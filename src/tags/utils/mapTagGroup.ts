import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import type { TagGroup } from "src/tags/Tag.type";
import type { TagGroupSchema } from "src/tags/tags.schema";

dayjs.extend(utc);

export const mapTagGroup = (tagGroup: TagGroupSchema): TagGroup => {
  return {
    id: tagGroup.id,
    title: tagGroup.title,
    tags: [],
    created: dayjs.utc(tagGroup.created).local(),
    updated: dayjs.utc(tagGroup.updated).local(),
  };
};
