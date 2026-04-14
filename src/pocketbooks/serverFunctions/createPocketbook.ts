import { createServerFn } from "@tanstack/react-start";
import { db } from "src/db/connection";
import { pocketbooks } from "src/pocketbooks/pocketbooks.schema";
import type { ColourName } from "src/colours/Colour.type";
import type { PocketbookSchema } from "src/pocketbooks/pocketbooks.schema";

type CreatePocketbookInput = {
  title: string;
  icon: string;
  colour: ColourName;
  notesSortBy: string;
  notesSortDirection: string;
  notesGroupBy: string | null;
  bookmarkedSortBy: string;
  bookmarkedSortDirection: string;
  bookmarkedGroupBy: string | null;
  userId: string | null;
};

export const createPocketbook = createServerFn({ method: "POST" })
  .inputValidator((input: CreatePocketbookInput) => input)
  .handler(async ({ data }): Promise<PocketbookSchema> => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(pocketbooks)
      .values({
        id,
        title: data.title,
        icon: data.icon,
        colour: data.colour,
        notesSortBy: data.notesSortBy,
        notesSortDirection: data.notesSortDirection,
        notesGroupBy: data.notesGroupBy,
        bookmarkedSortBy: data.bookmarkedSortBy,
        bookmarkedSortDirection: data.bookmarkedSortDirection,
        bookmarkedGroupBy: data.bookmarkedGroupBy,
        user: data.userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    return inserted;
  });
