export const setConsent = (granted: boolean | null) => {

  return {
    type: `SET_CONSENT_SUCCESS`,
    payload: { granted }
  };
}