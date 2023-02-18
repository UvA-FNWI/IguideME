import axios, { AxiosInstance } from "axios";

export default class Controller {
  protected static client: AxiosInstance;

  static baseURL(): string {
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}/`;
  }

  static setup(): void {
    // automatically set the base url of each request to the current host
    this.client = axios.create({
      baseURL: this.baseURL()
    });
  }
}
