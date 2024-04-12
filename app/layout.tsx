import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Campus Bridge",
  description: "Connecting students...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "green",
        },
      }}
    >
      <html lang="en" className="overflow-hidden">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
