import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Fuente premium para títulos
import "./globals.css";

// Fuente para cuerpo de texto (limpia)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Fuente para títulos (elegante/serif)
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Bioseta | Extractos Naturales Premium",
  description: "Eleva tu mente y cuerpo con extractos de hongos funcionales. Melena de León, Ashwagandha y más. Ciencia y naturaleza en cada frasco.",
  icons: {
    icon: "/favicon.ico", // Por ahora usará el default, luego lo cambiamos
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} bg-stone-950 text-stone-100 antialiased selection:bg-amber-500 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}