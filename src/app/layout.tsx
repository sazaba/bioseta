import type { Metadata } from "next";
// 1. Agregamos 'Cinzel' a la importación
import { Montserrat, Cormorant_Garamond, Cinzel } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["400", "500", "600", "700"], display: "swap" });

// 2. Configuramos Cinzel
const cinzel = Cinzel({ 
  subsets: ["latin"], 
  variable: "--font-cinzel",
  display: "swap" 
});

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
      {/* 3. Agregamos la variable cinzel.variable aquí abajo */}
      <body className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable} bg-[#0F1115] text-stone-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}