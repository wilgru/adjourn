import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "src/db/connection";
import { pocketbooks } from "src/pocketbooks/pocketbooks.schema";
import type { ColourName } from "src/colours/Colour.type";
import type { PocketbookSchema } from "src/pocketbooks/pocketbooks.schema";

type UpdatePocketbookInput = {
  pocketbookId: string;
  title: string;
  icon: string;
  colour: ColourName;
  notesSortBy: string;
  notesSortDirection: string;
  notesGroupBy: string | null;
  bookmarkedSortBy: string;
  bookmarkedSortDirection: string;
  bookmarkedGroupBy: string | null;
};

export const updatePocketbook = createServerFn({ method: "POST" })
  .inputValidator((input: UpdatePocketbookInput) => input)
  .handler(async ({ data }): Promise<PocketbookSchema> => {
    const now = new Date().toISOString();

    const [updated] = db
      .update(pocketbooks)
      .set({
        title: data.title,
        icon: data.icon,
        colour: data.colour,
        notesSortBy: data.notesSortBy,
        notesSortDirection: data.notesSortDirection,
        notesGroupBy: data.notesGroupBy,
        bookmarkedSortBy: data.bookmarkedSortBy,
        bookmarkedSortDirection: data.bookmarkedSortDirection,
        bookmarkedGroupBy: data.bookmarkedGroupBy,
        updated: now,
      })
      .where(eq(pocketbooks.id, data.pocketbookId))
      .returning()
      .all();

    return updated;
  });
