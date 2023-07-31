import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Refresh } from "./(components)/Refresh";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VIES VAT Checker | Admin Portal",
  description: "VIES VAT Checker | Admin Portal"
};

export default function RootLayout({
  requests,
  errors
}: {
  requests: React.ReactNode;
  errors: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="grid min-h-screen pt-12 pb-24 pl-24 pr-24 grid-cols-[2fr_3fr] gap-x-4 bg-slate-100">
          <div className="fixed bottom-2 right-2">
            <Refresh />
          </div>
          <div className="mb-auto">{requests}</div>
          <div className="mb-auto">{errors}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
