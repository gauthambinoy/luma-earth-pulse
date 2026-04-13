import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luma Earth Pulse — Live Global Dashboard · 200+ APIs",
  description:
    "Real-time global data dashboard with 200+ APIs — 3D interactive Earth, weather, earthquakes, crypto, forex, economy, energy, health, countries, space, ISS tracker, air quality, tech pulse, news. Zoom, rotate, explore the planet.",
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
