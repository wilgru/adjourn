export const useElectronEnvironment = () => {
  const isElectron = true;
  const isMac =
    typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  return {
    isElectron,
    isMacElectron: isElectron && isMac,
  };
};
