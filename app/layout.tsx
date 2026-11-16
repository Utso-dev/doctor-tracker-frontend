import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doctor Tracker - Healthcare & Patient Management",
  description: "Secure administrative web application to manage doctors and corresponding patients with real-time analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans bg-bgColor text-headerColor">
        {children}
      </body>
    </html>
  );
}
