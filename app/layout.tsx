import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unified World Data — Live Global Dashboard",
  description:
    "Real-time global data dashboard with 200+ APIs — weather, earthquakes, crypto, forex, economy, health, countries, space, ISS tracker, air quality, tech pulse, news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
