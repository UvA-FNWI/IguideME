import Controller from "../controller";

export default class ExternalDataController extends Controller {

  static validateData(data: any[]): boolean {
    return data.every(row => Object.keys(row).includes("studentloginid") &&
      Object.keys(row).includes("grade")
    );
  }
}