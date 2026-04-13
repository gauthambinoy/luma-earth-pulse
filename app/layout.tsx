import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sapien Signal — Live Global Dashboard · 200+ APIs",
  description:
    "Real-time global intelligence dashboard with 200+ APIs — 3D interactive Earth, weather, earthquakes, crypto, forex, economy, energy, health, countries, space, ISS tracker, air quality, tech pulse, news. The pulse of human civilization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
