import type { UpdateTint } from "src/updates/Update.type";

export const getTintClasses = (tint: UpdateTint | null | undefined) => {
  switch (tint) {
    case "red":
      return {
        card: "bg-red-50 border-red-100",
        meta: "text-red-400",
        notePill: "bg-red-100 text-red-600",
      };
    case "yellow":
      return {
        card: "bg-yellow-50 border-yellow-100",
        meta: "text-yellow-500",
        notePill: "bg-yellow-100 text-yellow-700",
      };
    case "green":
      return {
        card: "bg-green-50 border-green-100",
        meta: "text-green-500",
        notePill: "bg-green-100 text-green-700",
      };
    case "blue":
      return {
        card: "bg-blue-50 border-blue-100",
        meta: "text-blue-400",
        notePill: "bg-blue-100 text-blue-600",
      };
    default:
      return {
        card: "bg-slate-50 border-slate-100",
        meta: "text-slate-400",
        notePill: "bg-slate-100 text-slate-600",
      };
  }
};
