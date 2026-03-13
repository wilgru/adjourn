import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import Delta from "quill-delta";
import { mapNote } from "src/notes/utils/mapNote";
import type { RecordModel } from "pocketbase";
import type { Update } from "src/updates/Update.type";

dayjs.extend(utc);

export const mapUpdate = (update: RecordModel): Update => {
  return {
    id: update.id,
    content: update.content ? new Delta(update.content) : new Delta(),
    tint: update.tint || null,
    notes: update?.expand?.notes ? update.expand.notes.map(mapNote) : [],
    created: dayjs.utc(update.created).local(),
    updated: dayjs.utc(update.updated).local(),
  };
};
