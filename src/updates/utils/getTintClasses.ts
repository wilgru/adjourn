import type { UpdateTint } from "src/updates/Update.type";

export const getTintClasses = (tint: UpdateTint | null | undefined) => {
  switch (tint) {
    case "red":
      return {
        card: "bg-red-50",
        textColor: "#b91c1c", // red-700
        notePill: "bg-red-100 text-red-600 hover:bg-red-200",
        toolbarDivider: "border-red-200",
      };
    case "yellow":
      return {
        card: "bg-yellow-50",
        textColor: "#a16207", // yellow-700
        notePill: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        toolbarDivider: "border-yellow-200",
      };
    case "green":
      return {
        card: "bg-green-50",
        textColor: "#15803d", // green-700
        notePill: "bg-green-100 text-green-700 hover:bg-green-200",
        toolbarDivider: "border-green-200",
      };
    case "blue":
      return {
        card: "bg-blue-50",
        textColor: "#1d4ed8", // blue-700
        notePill: "bg-blue-100 text-blue-600 hover:bg-blue-200",
        toolbarDivider: "border-blue-200",
      };
    default:
      return {
        card: "bg-slate-50",
        textColor: "#334155", // slate-700
        notePill: "bg-slate-100 text-slate-600 hover:bg-slate-200",
        toolbarDivider: "border-slate-200",
      };
  }
};
