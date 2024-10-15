import axios from "axios";
import { getCookie, removeCookie } from "../utils/cookie";

export class ApiError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = ApiError.name;
  }
}

const api = axios.create({
  baseURL: "https://api.auto.inocencio.app.br",
  adapter: "fetch",
});

api.interceptors.request.use((request) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) request.headers["x-access-token"] = accessToken;
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      // error is a non-nullable object
      typeof error === "object" &&
      error !== null &&
      // error.response exists and is a non-nullable object
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      // error.response.data exists and is a non-nullable object
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      // error.response.data.message exists and is a string
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
    ) {
      if (error.response.data.message === "Não Autorizado") {
        removeCookie("accessToken");
        window.location.reload();
      }

      return Promise.reject(new ApiError(error.response.data.message));
    }

    throw Promise.reject(error);
  },
);

export { api };
