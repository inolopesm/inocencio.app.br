import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "inoauto",
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => children;

export default Layout;
