"use client";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3 cursor-pointer select-none group">
      {/* Icono Vectorial Premium */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Animación "spring" elegante
        className="relative w-10 h-10"
      >
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          {/* Definición del Gradiente Dorado Rico */}
          <defs>
            <linearGradient id="luxury-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FCD34D' }} />   {/* Oro claro */}
              <stop offset="50%" style={{ stopColor: '#F59E0B' }} />   {/* Oro medio */}
              <stop offset="100%" style={{ stopColor: '#B45309' }} />  {/* Bronce oscuro */}
            </linearGradient>
          </defs>
          {/* Forma abstracta de hongo/joya */}
          <path
            fill="url(#luxury-gold)"
            d="M20 2C14.477 2 10 6.477 10 12C10 15.53 11.837 18.646 14.636 20.455L18 38H22L25.364 20.455C28.163 18.646 30 15.53 30 12C30 6.477 25.523 2 20 2ZM20 6C23.314 6 26 8.686 26 12C26 13.356 25.546 14.612 24.778 15.627L20 28L15.222 15.627C14.454 14.612 14 13.356 14 12C14 8.686 16.686 6 20 6Z"
          />
        </svg>
      </motion.div>

      {/* Texto del Logo con la nueva tipografía y gradiente */}
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        // Usamos font-serif que ahora es Cormorant Garamond
        className="text-3xl font-serif font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-600"
      >
        BIOSETA
      </motion.span>
    </div>
  );
};