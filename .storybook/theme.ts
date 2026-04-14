import { create } from "@storybook/theming/create";

export default create({
  base: "light",

  // Typography
  fontBase: '"Helvetica Neue", sans-serif',
  fontCode: "monospace",

  brandTitle: "Pocketbook",
  brandUrl: "https://github.com/wilgru/pocketbook-react-app",
  // brandImage: "https://github.com/wilgru/pocketbook-react-app",
  brandTarget: "_self",

  //
  colorPrimary: "#f97316",
  colorSecondary: "#f97316",

  // UI
  appBg: "#fafaf9",
  appContentBg: "#fafaf9",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e7e5e4",
  appBorderRadius: 16,

  // Text colors
  textColor: "#44403c",
  textInverseColor: "#fafaf9",

  // Toolbar default and active colors
  barTextColor: "#44403c",
  barSelectedColor: "#f97316",
  barHoverColor: "#f97316",
  barBg: "#fafaf9",

  // Form colors
  inputBg: "#ffffff",
  inputBorder: "#e7e5e4",
  inputTextColor: "#44403c",
  inputBorderRadius: 6,
});
