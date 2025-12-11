"use client";
import { LuxuryLogo } from "@/components/LuxuryLogo"; // Asegúrate de que esta ruta sea correcta
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    // CAMBIO CLAVE: min-h-[100dvh] asegura que ocupe la pantalla real visible en móviles
    <section className="relative flex flex-col items-center justify-center min-h-[100dvh] text-center px-4 overflow-hidden bg-[#0a0a0a]">
      
      {/* 1. ATMÓSFERA & TEXTURA (Noise Grain) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>
      
      {/* Luz Ambiental Central (Glow detrás del logo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* 2. CONTENIDO PRINCIPAL */}
      {/* mt-[-5vh] ajusta el centro óptico para que se vea equilibrado visualmente */}
      <div className="relative z-10 flex flex-col items-center mt-[-5vh]"> 
        
        {/* LOGO con Entrada Suave Cinemática */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8 md:mb-12"
        >
          {/* Logo responsivo: w-56 en móvil, w-80 en escritorio */}
          <LuxuryLogo className="w-56 h-56 md:w-80 md:h-80 drop-shadow-[0_0_40px_rgba(251,191,36,0.2)]" />
        </motion.div>

        {/* ETIQUETA SUPERIOR (Detalle Alquimista) */}
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-amber-500 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 opacity-80"
        >
          Est. MMXXV
        </motion.span>

        {/* TÍTULO EDITORIAL GIGANTE */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-serif text-5xl md:text-8xl text-white mb-6 leading-[0.9] tracking-tight"
        >
          ALQUIMIA <br />
          {/* Gradiente dorado metálico */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-[#B45309]">
            NATURAL
          </span>
        </motion.h1>
        
        {/* SUBTÍTULO CON LÍNEA */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="font-sans text-stone-400 text-xs md:text-sm tracking-[0.2em] uppercase max-w-xs md:max-w-xl mx-auto leading-relaxed border-t border-white/10 pt-6 mt-2"
        >
          Ciencia micológica para la consciencia superior.
        </motion.p>
      </div>

      {/* 3. INDICADOR DE SCROLL ELEGANTE */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-white/20"
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">Descubrir</span>
        {/* Línea vertical que respira (pulsa) */}
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/0 animate-pulse"></div>
      </motion.div>

    </section>
  );
};