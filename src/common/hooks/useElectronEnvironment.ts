export const useElectronEnvironment = () => {
  const isElectrobun = import.meta.env.VITE_ELECTROBUN === "true";
  const isMac =
    typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  return {
    isElectrobun,
    isMacElectrobun: isElectrobun && isMac,
  };
};
