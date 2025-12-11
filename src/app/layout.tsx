import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond, Cinzel } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["300", "400", "500", "600", "700"], display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });

export const metadata: Metadata = {
  title: "Bioseta | Ultra Premium",
  description: "Extractos naturales de alta gama.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable} bg-[#050505] text-stone-100 antialiased`}>
        {/* AQUÍ YA NO HAY NAVBAR NI FOOTER */}
        {children}
      </body>
    </html>
  );
}