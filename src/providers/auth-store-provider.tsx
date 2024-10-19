"use client";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { createAuthStore } from "../stores/auth-store";
import type { AuthStore } from "../stores/auth-store";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined,
);

export type AuthStoreProviderProps = {
  children: React.ReactNode;
};

export const AuthStoreProvider = ({ children }: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi>();
  if (!storeRef.current) storeRef.current = createAuthStore();

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);

  if (!authStoreContext)
    throw new Error("useAuthStore must be used within AuthStoreProvider");

  return useStore(authStoreContext, selector);
};
