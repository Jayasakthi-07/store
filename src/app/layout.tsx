import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A8X Store | Premium Free Fire IDs",
  description: "Browse and buy premium Free Fire IDs directly from the seller.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          {children}
        </div>
      </body>
    </html>
  );
}
