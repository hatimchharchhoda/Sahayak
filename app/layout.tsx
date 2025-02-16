import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/custom/Navbar";
import DisplayNavbar from "@/components/custom/DisplayNavbar";
import Footer from "@/components/custom/Footer";
import { UserProvider } from "@/context/userContext";
import DisplayFooter from "@/components/custom/DisplayFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sayahak",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <DisplayNavbar /> {children}
          <Toaster />
          <DisplayFooter />
        </UserProvider>
      </body>
    </html>
  );
}
