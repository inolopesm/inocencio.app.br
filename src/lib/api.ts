import axios from "axios";

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

/**
 * TODO: refatorar para que a função receba o accessToken para não precisar
 * pegar dessa forma
 */
api.interceptors.request.use((request) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const accessToken = JSON.parse(
    window.sessionStorage.getItem("auth-storage") ?? "{}",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  )?.state?.accessToken?.encoded;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (accessToken) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    request.headers["x-access-token"] = accessToken;
  }

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
        window.sessionStorage.removeItem("auth-storage");
        window.location.reload();
      }

      return Promise.reject(new ApiError(error.response.data.message));
    }

    /** @see https://axios-http.com/docs/interceptors */
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(error);
  },
);

export { api };
