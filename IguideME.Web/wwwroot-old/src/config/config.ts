export const debug = () => {
  // TODO: this has to be done in a way that doesn't cause syntax errors to pop up when debugflag.js doesn't exist.
  if ((window as any).DEBUGFLAG !== undefined)
    return true;

  const { REACT_APP_DEBUG } = process.env;

  if (!REACT_APP_DEBUG) return false;
  return REACT_APP_DEBUG === "1";
}
