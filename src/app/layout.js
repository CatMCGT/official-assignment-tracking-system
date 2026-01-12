import { Lato } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | Assignment Tracking System",
    default: "Assignment Tracking System",
  },
  description: "Created for ABC College",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lato.className} antialiased h-screen`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
