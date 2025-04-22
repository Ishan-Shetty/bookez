import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "~/components/navigation/navbar";
import { Toaster } from "~/components/ui/toaster";
import { AuthProvider } from "~/components/auth/auth-provider";

export const metadata: Metadata = {
  title: "BookEZ - Movie Ticket Booking",
  description: "Book movie tickets easily with BookEZ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="min-h-screen bg-background">
        <AuthProvider>
          <TRPCReactProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-4">
                <div className="container flex items-center justify-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} BookEZ. All rights reserved.
                </div>
              </footer>
            </div>
            <Toaster />
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
