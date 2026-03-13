export const getDisplayUrl = (url: string): string => {
  return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
};
