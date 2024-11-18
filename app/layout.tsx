import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { 
  ClerkProvider
} from "@clerk/nextjs";
import React from "react";

const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['400','500','600','700'],
  variable: '--font-ibm-plex'
})


export const metadata: Metadata = {
  title: "Creona",
  description: "Edit to your hearts content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
        variables:{colorPrimary:'#624cf5'}
      }}>
      <html lang="en">
        <body
          className={`${cn("font-IBMPlex antialiased", IBMPlex.variable)}`}
          >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
