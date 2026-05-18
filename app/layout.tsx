import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Sidebar from "./components/Sidebar";
import { LangProvider } from "../lib/lang";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Nexus Dashboard",
  description: "AI-powered analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${plusJakarta.variable}`}>
      <body>
        <LangProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="app-main">{children}</main>
          </div>
        </LangProvider>
      </body>
    </html>
  );
}
