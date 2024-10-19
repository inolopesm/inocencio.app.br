import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import favicon from "../assets/images/favicon.svg";
import "../tailwind.css";
import type { Metadata } from "next";

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

  /**
   * Usando any para segundo o next.js, evitar conflitos entre o plugin
   * @svgr/webpack ou o plugin babel-plugin-inline-react-svg
   */

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  icons: [favicon.src],
};

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <html className={`${poppins.variable} ${coHeadline.variable}`} lang="pt-BR">
    <body className="font-sans antialiased">{children}</body>
  </html>
);

export default Layout;
