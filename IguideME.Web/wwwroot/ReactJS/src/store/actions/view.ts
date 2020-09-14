import {ITile} from "../../models/ITile";

export const setView = async (view: ITile | null) => {
  return {
    type: `SET_VIEW_SUCCESS`,
    payload: view
  }
};
