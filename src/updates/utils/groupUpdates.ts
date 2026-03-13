import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { Update, UpdatesGroup } from "src/updates/Update.type";

const getRelativeDateTitle = (date: Dayjs): string => {
  const today = dayjs();
  const diffDays = today.diff(date, "day");

  if (diffDays === 0) return `Today, ${date.format("MMMM D")}`;
  if (diffDays === 1) return `Yesterday, ${date.format("MMMM D")}`;
  if (diffDays < 7) return date.format("dddd, MMMM D");
  if (diffDays < 30) return date.format("MMMM D");
  return date.format("MMMM D, YYYY");
};

export const groupUpdates = (updates: Update[]): UpdatesGroup[] => {
  const groupedUpdates = updates.reduce(
    (acc: UpdatesGroup[], update: Update) => {
      const title = getRelativeDateTitle(update.created);
      const existingGroup = acc.find((group) => group.title === title);

      if (existingGroup) {
        existingGroup.updates.push(update);
      } else {
        acc.push({
          title,
          updates: [update],
        });
      }

      return acc;
    },
    [],
  );

  return groupedUpdates;
};
