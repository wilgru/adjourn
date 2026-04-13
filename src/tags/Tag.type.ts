import type { TagGroupSchema, TagSchema } from "./tags.schema";
import type { Dayjs } from "dayjs";
import type { Colour } from "src/colours/Colour.type";
import type { Link } from "src/common/types/Link.type";
import type { Prettify } from "src/common/types/Prettify.type";

export type TagLink = Link;

export type Tag = Prettify<
  Omit<
    TagSchema,
    | "colour"
    | "links"
    | "groupBy"
    | "sortBy"
    | "sortDirection"
    | "tagGroup"
    | "journal"
    | "user"
    | "created"
    | "updated"
  > & {
    colour: Colour;
    links: TagLink[];
    groupBy: "created" | "tag" | null;
    sortBy: "alphabetical" | "created";
    sortDirection: "asc" | "desc";
    tagGroupId: string | null;
    noteCount: number;
    created: Dayjs;
    updated: Dayjs;
  }
>;

export type TagGroup = Prettify<
  Omit<TagGroupSchema, "journal" | "user" | "created" | "updated"> & {
    tags: Tag[];
    created: Dayjs;
    updated: Dayjs;
  }
>;
