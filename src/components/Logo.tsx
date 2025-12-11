"use client";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none group">
      {/* Icono Vectorial Animado con un sutil brillo */}
      <motion.div
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-8 h-8 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-transform group-hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.65 3.32 1.71 4.54L10 22h4l3.29-8.46A6.97 6.97 0 0019 9c0-3.87-3.13-7-7-7zm0 2a5 5 0 015 5c0 1.1-.36 2.13-.97 2.97L12 18l-4.03-6.03A4.978 4.978 0 017 9c0-2.76 2.24-5 5-5z" />
        </svg>
      </motion.div>

      {/* Texto del Logo con Gradiente Dorado */}
      <motion.span
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-2xl font-bold tracking-tighter font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 transition-opacity group-hover:opacity-80"
      >
        BIOSETA
      </motion.span>
    </div>
  );
};