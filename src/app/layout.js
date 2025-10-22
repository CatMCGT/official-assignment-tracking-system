import { Lato } from "next/font/google";
import "./globals.css";
import { VercelToolbar } from "@vercel/toolbar/next";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Assignment Tracking System",
  description: "Created for ABC College",
};

export default function RootLayout({ children }) {
  const shouldInjectToolbar = process.env.NODE_ENV === "development";
  return (
    <html lang="en">
      <body className={`${lato.className} antialiased h-screen`}>
        {children}
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
