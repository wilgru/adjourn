import type { Colour } from "src/colours/Colour.type";

const COLOUR_HEX_MAP: Record<string, string> = {
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  purple: "#a855f7",
  brown: "#d97706",
  grey: "#6b7280",
};

export const getColourHex = (colour: Colour): string => {
  return COLOUR_HEX_MAP[colour.name] ?? "#f97316";
};
