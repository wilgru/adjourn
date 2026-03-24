import type { TagGroupSchema, TagSchema } from "./tags.schema";
import type { Dayjs } from "dayjs";
import type { Colour } from "src/colours/Colour.type";

export type TagLink = {
  id: string;
  title?: string;
  link: string;
};

export type Tag = Omit<
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
};

export type TagGroup = Omit<
  TagGroupSchema,
  "journal" | "user" | "created" | "updated"
> & {
  tags: Tag[];
  created: Dayjs;
  updated: Dayjs;
};
