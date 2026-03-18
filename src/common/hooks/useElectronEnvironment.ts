export const useElectronEnvironment = () => {
  const isElectron = import.meta.env.VITE_ELECTRON === "true";
  const isMac =
    typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  return {
    isElectron,
    isMacElectron: isElectron && isMac,
  };
};
