import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SPARTA",
  description: "Sistem Pemetaan dan Rekomendasi Wisata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full", "antialiased", poppins.variable)}>
      {/* Tambahkan font-sans agar seluruh body otomatis menggunakan font Poppins */}
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
