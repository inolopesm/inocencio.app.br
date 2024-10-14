import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./tailwind.css";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/index-page"),
  },
  {
    path: "/auto",
    lazy: () => import("./pages/auto-page"),
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
