import { type AxiosResponse } from "axios";
import apiClient from "./axios";

const setup = async (): Promise<AxiosResponse<any, any>> =>
  await apiClient.post("app/setup");
export default setup;
