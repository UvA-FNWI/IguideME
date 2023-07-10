export const debug = () => {
    const { REACT_APP_DEBUG } = process.env;

    if (!REACT_APP_DEBUG) return false;
    return REACT_APP_DEBUG === "1";
  }
