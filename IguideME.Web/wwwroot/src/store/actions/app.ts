import LayoutController from "../../api/controllers/layout";

export class AppActions {

  static SET_DASHBOARD_COLUMNS_SUCCESS = "SET_DASHBOARD_COLUMNS_SUCCESS";
  static SET_DASHBOARD_COLUMNS_ERROR = "SET_DASHBOARD_COLUMNS_ERROR";

  static loadColumns = async () => {
    const columns = await LayoutController.getColumns();

    if (columns)
      return {
        type: AppActions.SET_DASHBOARD_COLUMNS_SUCCESS,
        payload: columns
      }

    return {
      type: AppActions.SET_DASHBOARD_COLUMNS_ERROR,
    }
  }
}