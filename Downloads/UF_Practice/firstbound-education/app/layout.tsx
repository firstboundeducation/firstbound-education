import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FirstBound Education",
  description: "Accessible tutoring and student support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <body>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}