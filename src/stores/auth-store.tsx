import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  accessTokenEncoded: string;
  accessTokenDecodedSub: string;
  authenticated: boolean;
};

type Action = {
  login: (accessToken: string) => void;
  logout: () => void;
};

const makeState = (accessToken: string): State => ({
  authenticated: accessToken !== "",
  accessTokenEncoded: accessToken,
  accessTokenDecodedSub: accessToken
    ? z.object({ sub: z.string() }).parse(jwtDecode(accessToken)).sub
    : "",
});

const initialState: State = makeState("");

const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      ...initialState,
      login: (accessToken) => set(makeState(accessToken)),
      logout: () => set(initialState),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => window.sessionStorage),
    },
  ),
);

export { useAuthStore };
