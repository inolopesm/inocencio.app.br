import { lazy } from "react";

import {
  Navigate,
  Outlet,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";

const AutoAdminLayout = lazy(() => import("./layouts/auto-admin-layout"));
const Authenticated = lazy(() => import("./components/authenticated"));
const AutoAdminPage = lazy(() => import("./pages/auto-admin-page"));

// biome-ignore format: better readability
const AutoAdminAutomoveisPage = lazy(() => import("./pages/auto-admin-automoveis-page"));

// biome-ignore format: better readability
const AutoAdminEntrarPage = lazy(() => import("./pages/auto-admin-entrar-page"));

// biome-ignore format: better readability
const AutoAdminAutomoveisNovoPage = lazy(() => import("./pages/auto-admin-automoveis-novo"));

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({ Component: lazy(() => import("./pages/index-page")) }),
  },
  {
    path: "/auto",
    lazy: async () => ({ Component: lazy(() => import("./pages/auto-page")) }),
  },
  {
    path: "/auto/admin",
    lazy: async () => {
      const { Toaster } = await import("sonner");

      return {
        Component: () => {
          const location = useLocation();
          const isAdminEntrarPage = location.pathname !== "/auto/admin/entrar";

          return (
            <>
              {isAdminEntrarPage ? <AutoAdminLayout /> : <Outlet />}
              <Toaster richColors />
            </>
          );
        },
      };
    },
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: () => (
            <Authenticated>
              <AutoAdminPage />
            </Authenticated>
          ),
        }),
      },
      {
        path: "/auto/admin/automoveis",
        lazy: async () => ({
          Component: () => (
            <Authenticated>
              <AutoAdminAutomoveisPage />
            </Authenticated>
          ),
        }),
      },
      {
        path: "/auto/admin/automoveis/novo",
        lazy: async () => ({
          Component: () => (
            <Authenticated>
              <AutoAdminAutomoveisNovoPage />
            </Authenticated>
          ),
        }),
      },
      {
        path: "/auto/admin/entrar",
        lazy: async () => {
          const { useAuthStore } = await import("./stores/auth-store");

          return {
            Component: () => {
              const authenticated = useAuthStore((s) => s.authenticated);
              if (authenticated) return <Navigate to="/auto/admin" />;
              return <AutoAdminEntrarPage />;
            },
          };
        },
      },
    ],
  },
]);
