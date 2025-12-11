import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond, Cinzel } from "next/font/google";
import { Navbar } from "../components/layout/Navbar"; // <--- Importamos el Navbar aquí
import "./globals.css";

// Configuración de fuentes
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["400", "500", "600", "700"], display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });

export const metadata: Metadata = {
  title: "Bioseta | Ultra Premium",
  description: "Extractos naturales de alta gama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable} bg-[#0F1115] text-stone-100 antialiased`}>
        
        {/* El Navbar vive aquí para siempre, visible en todas las páginas */}
        <Navbar />
        
        {children}
      </body>
    </html>
  );
}