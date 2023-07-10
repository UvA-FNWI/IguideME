import Controller from "../controller";
import {DashboardColumn} from "../../models/app/Layout";
import {debug} from "../../config/config";
import {MOCK_COLUMNS} from "../../mocks/tile/column";
import {delay} from "../../utils/mockRequest";

export default class LayoutController extends Controller {

  static getColumns(): Promise<DashboardColumn[]> {
    if (debug()) return delay(MOCK_COLUMNS);

    return this.client.get(
      `layout/columns`
    ).then(response => response.data);
  }

  static updateColumn(column: DashboardColumn): Promise<DashboardColumn> {
    if (debug()) return delay(column);

    return this.client.patch(
      `layout/columns/${column.id}`, column
    ).then(response => response.data);
  }

  static deleteColumn(id: number): Promise<DashboardColumn[]> {
    if (debug()) return delay(MOCK_COLUMNS);

    return this.client.delete(
      `layout/columns/${id}`
    ).then(response => response.data);
  }

  static createColumn(column: DashboardColumn): Promise<DashboardColumn> {
    if (debug()) return Promise.resolve(column);

    return this.client.post(
      `layout/columns`, column
    ).then(response => response.data);
  }
}