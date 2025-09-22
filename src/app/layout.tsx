import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Providers from "./provider";

export const metadata: Metadata = {
  title: "Essential Idioms in English",
  description: "Essential Idioms in English",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden font-interVariable">
          <Providers>
            <div className="h-full w-full bg-[#fff] max-tablet:backdrop-blur-2xl text-black z-20">
              {children}
            </div>
          </Providers>
          <Toaster />
      </body>
    </html>
  );
}