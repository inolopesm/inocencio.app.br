"use client";

import { Toaster } from "sonner";
import { AuthStoreProvider } from "../../../providers/auth-store-provider";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <AuthStoreProvider>{children}</AuthStoreProvider>
      <Toaster richColors />
    </>
  );
};

export default Layout;
