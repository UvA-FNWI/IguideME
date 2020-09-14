import axios from "axios";

export default class Controller {
  protected static client: any;

  static setup(): void {
    this.client = axios.create({ baseURL: `https://localhost:5001/` });
  }
}
