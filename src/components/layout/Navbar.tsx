"use client";
import { LuxuryLogo } from "@/components/LuxuryLogo"; // Asegúrate de mover el logo a la carpeta components si no lo has hecho
import Link from "next/link";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0F1115]/80 border-b border-white/5"
    >
      {/* 1. Logo Pequeño a la Izquierda */}
      <Link href="/" className="flex items-center gap-3 group">
        <LuxuryLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
      </Link>

      {/* 2. Enlaces Centrales (Opcional) */}
      <div className="hidden md:flex items-center gap-8 text-xs font-sans tracking-[0.2em] text-amber-100/60">
        <Link href="#" className="hover:text-amber-400 transition-colors">PRODUCTOS</Link>
        <Link href="#" className="hover:text-amber-400 transition-colors">CIENCIA</Link>
        <Link href="#" className="hover:text-amber-400 transition-colors">NOSOTROS</Link>
      </div>

      {/* 3. Botón de Acción (Carrito/Shop) */}
      <button className="text-xs font-bold tracking-[0.2em] text-[#0F1115] bg-gradient-to-r from-amber-200 to-amber-500 px-6 py-2 rounded-sm hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all">
        SHOP
      </button>
    </motion.nav>
  );
};