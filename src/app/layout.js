import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Assignment Tracking System",
  description: "Created for ABC College",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${lato.className} antialiased h-full`}>{children}</body>
    </html>
  );
}
