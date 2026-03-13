import { getColour } from "src/colours/utils/getColour";
import type { RecordModel } from "pocketbase";
import type { Tag } from "src/tags/Tag.type";

export const mapTag = (tag: RecordModel): Tag => {
  return {
    id: tag.id,
    name: tag.name,
    colour: getColour(tag.colour),
    icon: tag.icon,
    description: tag.description ?? null,
    noteCount: tag.totalNotes,
    links: tag.links || [],
    groupBy: tag.groupBy,
    sortBy: tag.sortBy ?? "created",
    sortDirection: tag.sortDirection ?? "asc",
    tagGroupId: tag.tagGroup || null,
    created: tag.createdAt,
    updated: tag.updatedAt,
  };
};
