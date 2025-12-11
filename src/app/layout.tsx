import type { Metadata } from "next";
// Importamos las nuevas fuentes premium
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Fuente para cuerpo de texto (moderna, limpia, alta legibilidad)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Fuente para títulos (clásica, elegante, lujosa)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"], // Varios pesos para versatilidad
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bioseta | Extractos Naturales de Alta Gama",
  description: "Redescubre tu potencial con la pureza de la naturaleza. Suplementos de hongos funcionales ultra-premium.",
  // El favicon lo actualizaremos en el siguiente paso
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      {/* Aplicamos las nuevas variables de fuente al body */}
      <body className={`${montserrat.variable} ${cormorant.variable} bg-[#0a0a0a] text-stone-100 antialiased selection:bg-amber-500/30 selection:text-amber-100`}>
        {children}
      </body>
    </html>
  );
}