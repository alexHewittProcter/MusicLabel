export const SET_USER_SETTINGS = "SET_USER_SETTINGS";

export function setUserSettings(settings) {
  return {
    type: SET_USER_SETTINGS,
    payload: settings
  };
}
