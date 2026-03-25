import { colours } from "src/colours/colours.constant";
import type { Colour, ColourName } from "src/colours/Colour.type";

export const getColour = (name: ColourName): Colour => {
  return colours[name];
};

export const getAllColours = (): Colour[] => {
  return Object.values(colours);
};
