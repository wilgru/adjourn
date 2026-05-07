import type { UpdateTint } from "src/updates/Update.type";

export const getTintClasses = (tint: UpdateTint | null | undefined) => {
  switch (tint) {
    case "red":
      return {
        card: "bg-red-50",
        cardBorder: "border border-red-200",
        notePill: "bg-red-100 text-red-600 hover:bg-red-200",
        toolbarDivider: "border-red-200",
      };
    case "yellow":
      return {
        card: "bg-yellow-50",
        cardBorder: "border border-yellow-200",
        notePill: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        toolbarDivider: "border-yellow-200",
      };
    case "green":
      return {
        card: "bg-green-50",
        cardBorder: "border border-green-200",
        notePill: "bg-green-100 text-green-700 hover:bg-green-200",
        toolbarDivider: "border-green-200",
      };
    case "blue":
      return {
        card: "bg-blue-50",
        cardBorder: "border border-blue-200",
        notePill: "bg-blue-100 text-blue-600 hover:bg-blue-200",
        toolbarDivider: "border-blue-200",
      };
    default:
      return {
        card: "bg-slate-50",
        cardBorder: "border border-slate-200",
        notePill: "bg-slate-100 text-slate-600 hover:bg-slate-200",
        toolbarDivider: "border-slate-200",
      };
  }
};
