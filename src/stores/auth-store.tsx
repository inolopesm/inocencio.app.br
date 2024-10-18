import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const AccessTokenSchema = z.object({ email: z.string(), name: z.string() });

type State = {
  accessToken: { encoded: string; decoded: z.infer<typeof AccessTokenSchema> };
  authenticated: boolean;
};

type Action = {
  login: (accessToken: string) => void;
  logout: () => void;
};

export type AuthStore = State & Action;

const makeState = (accessToken: string): State => ({
  authenticated: accessToken !== "",

  accessToken: {
    encoded: accessToken,
    decoded: accessToken
      ? AccessTokenSchema.parse(jwtDecode(accessToken))
      : { email: "", name: "" },
  },
});

const defaultInitialState: State = makeState("");

const createAuthStore = (initialState: State = defaultInitialState) =>
  create<AuthStore>()(
    persist(
      (set) => ({
        ...initialState,
        login: (accessToken) => set(makeState(accessToken)),
        logout: () => set(initialState),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => window.sessionStorage),
        skipHydration: true,
      },
    ),
  );

export { createAuthStore };
