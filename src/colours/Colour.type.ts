export enum ColourName {
  red = "red",
  orange = "orange",
  yellow = "yellow",
  lime = "lime",
  green = "green",
  blue = "blue",
  cyan = "cyan",
  pink = "pink",
  purple = "purple",
  brown = "brown",
  grey = "grey",
}

export type Colour = {
  name: ColourName;
  text: string;
  textPill: string;
  textPillInverted: string;
  background: string;
  backgroundPill: string;
  backgroundPillInverted: string;
  backgroundGlow: string;
};
