import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reliant Electric | Northern Nevada Electrical Construction",
  description: "Design-build electrical construction, service and 24/7 emergency support from a local Northern Nevada team with 20 years of experience.",
  metadataBase: new URL("https://reliantreno.com"),
  openGraph: {
    title: "Built here. Built to last. | Reliant Electric",
    description: "20 years of design-build electrical construction in Northern Nevada.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
