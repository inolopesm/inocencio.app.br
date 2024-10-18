import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import favicon from "../assets/images/favicon.svg";
import "../tailwind.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-poppins",
});

const coHeadline = localFont({
  src: "../assets/fonts/CoHeadline-Regular.ttf",
  display: "swap",
  variable: "--font-co-headline",
});

export const metadata: Metadata = {
  title: "inolopesm",
  icons: [favicon.src],
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <html lang="pt-BR" className={`${poppins.variable} ${coHeadline.variable}`}>
    <body className="font-sans antialiased">{children}</body>
  </html>
);

export default Layout;
