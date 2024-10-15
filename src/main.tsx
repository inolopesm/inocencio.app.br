import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import "./tailwind.css";
import { CircleNotch } from "@phosphor-icons/react";
import { useAuthStore } from "./stores/auth-store";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/index-page"),
  },
  {
    path: "/auto",
    lazy: () => import("./pages/auto-page"),
  },
  {
    path: "/auto/admin",
    lazy: async () => {
      const { Outlet } = await import("react-router-dom");
      const { Toaster } = await import("sonner");

      return {
        Component: () => (
          <>
            <Suspense
              fallback={
                <div className="fixed flex min-h-screen w-full items-center justify-center bg-gray-100">
                  <CircleNotch className="size-12 animate-spin text-primary" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
            <Toaster richColors />
          </>
        ),
      };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const Component = lazy(() => import("./pages/auto-admin-page"));

          return {
            Component: () => {
              const authenticated = useAuthStore(
                (state) => state.authenticated,
              );

              if (!authenticated) {
                return <Navigate to="/auto/admin/entrar" />;
              }

              return <Component />;
            },
          };
        },
      },
      {
        path: "/auto/admin/entrar",
        lazy: async () => {
          const Component = lazy(
            () => import("./pages/auto-admin-entrar-page"),
          );

          return {
            Component: () => {
              const authenticated = useAuthStore(
                (state) => state.authenticated,
              );

              if (authenticated) {
                return <Navigate to="/auto/admin" />;
              }

              return <Component />;
            },
          };
        },
      },
    ],
  },
]);

const container = document.getElementById("root");

if (container === null) {
  throw new Error("Element #container not found");
}

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
