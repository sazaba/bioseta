"use client";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[100dvh] text-center px-4 overflow-hidden bg-[#0a0a0a]">
      
      {/* 1. ATMÓSFERA & TEXTURA (Noise Grain) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>
      
      {/* Luz Ambiental (Más grande y sutil para llenar el vacío del logo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* 2. CONTENIDO PRINCIPAL (Solo Texto) */}
      <div className="relative z-10 flex flex-col items-center"> 
        
        {/* ETIQUETA SUPERIOR */}
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-amber-500/80 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-8 md:mb-10"
        >
          Est. MMXXV
        </motion.span>

        {/* TÍTULO GIGANTE (Tipografía Montserrat Black del Catálogo) */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
          // AQUÍ ESTÁ EL CAMBIO: font-sans (Montserrat) + font-black (Peso 900)
          className="font-sans font-black text-6xl md:text-[9rem] text-white leading-[0.85] tracking-tighter uppercase"
        >
          ALQUIMIA <br />
          {/* Gradiente dorado metálico */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-[#B45309]">
            NATURAL
          </span>
        </motion.h1>
        
        {/* SUBTÍTULO */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-serif italic text-stone-400 text-lg md:text-2xl max-w-xs md:max-w-xl mx-auto leading-relaxed mt-10 md:mt-12"
        >
          "Ciencia micológica para la consciencia superior."
        </motion.p>
      </div>

      {/* 3. INDICADOR DE SCROLL */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-4 text-white/20"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase font-mono">Explorar</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0 animate-pulse"></div>
      </motion.div>

    </section>
  );
};