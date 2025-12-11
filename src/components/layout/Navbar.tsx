"use client";
import { LuxuryLogo } from "../LuxuryLogo"; // Ajusta la ruta si moviste el archivo
import Link from "next/link";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0F1115]/60 border-b border-white/5"
    >
      {/* 1. Logo Minimalista (Sin texto extra) */}
      <Link href="/" className="flex items-center gap-3 group">
        {/* Aumenté un poco el tamaño para que se aprecien los detalles del oro */}
        <LuxuryLogo className="w-12 h-12 group-hover:scale-105 transition-transform duration-500" />
      </Link>

      {/* 2. Enlaces Centrales (Opcional - Estilo invisible/elegante) */}
      <div className="hidden md:flex items-center gap-10">
        {["Colección", "Ciencia", "Manifiesto"].map((item) => (
          <Link 
            key={item} 
            href="#" 
            className="text-[10px] font-sans font-medium tracking-[0.25em] text-amber-100/50 hover:text-amber-200 transition-colors uppercase"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* 3. Botón SHOP "Ultra Premium" */}
      <button className="group relative px-8 py-3 overflow-hidden rounded-sm transition-all duration-300">
        {/* Fondo: Negro puro por defecto */}
        <div className="absolute inset-0 bg-transparent border border-amber-500/30 group-hover:border-amber-400/80 transition-colors duration-500"></div>
        
        {/* Efecto de Brillo/Luz al hacer hover (Glassmorphism dorado) */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/10 via-amber-400/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        
        {/* Texto: Espaciado amplio y tipografía sans limpia */}
        <span className="relative z-10 flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-amber-100/90 group-hover:text-white uppercase font-sans">
          Shop
          {/* Pequeña flecha que aparece al hover */}
          <svg className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </button>

    </motion.nav>
  );
};