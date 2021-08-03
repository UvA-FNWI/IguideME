import {Tile} from "../../models/app/Tile";
import {store} from "../../utils/configureStore";
import UserController from "../../api/controllers/app";

export class UserActions {

  static SET_USER_SUCCESS = "SET_USER_SUCCESS";
  static SET_USER_ERROR = "SET_USER_ERROR";

  static getUser = async () => {
    const user = await UserController.getUser();

    if (user)
      return {
        type: UserActions.SET_USER_SUCCESS,
        payload: user
      }

    return {
      type: UserActions.SET_USER_ERROR,
    }
  }
}