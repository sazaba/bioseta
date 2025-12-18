"use client";
import { memo } from "react";
import { motion } from "framer-motion";

// 1. COMPONENTE DE RUIDO (Sin cambios)
const StaticNoise = memo(() => (
  <div 
    className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: '120px 120px'
    }}
  />
));
StaticNoise.displayName = "StaticNoise";

// 2. VECTOR MEMOIZADO (Sin cambios)
const FungiTopoColor = memo(({ color, duration, reverse = false }: { color: string, duration: number, reverse?: boolean }) => {
    return (
        <motion.div
            className="w-full h-full will-change-transform"
            animate={{ rotate: reverse ? -360 : 360 }}
            transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
        >
            <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.1" />
                        <stop offset="50%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                <g>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <path
                            key={i}
                            d={`M250,250 m-${50 + i * 35},0 a${50 + i * 35},${50 + i * 35} 0 1,0 ${100 + i * 70},0 a${50 + i * 35},${50 + i * 35} 0 1,0 -${100 + i * 70},0`}
                            stroke={`url(#grad-${color})`}
                            strokeWidth={1.5}
                            vectorEffect="non-scaling-stroke"
                            opacity={1 - i * 0.1}
                        />
                    ))}
                </g>
                <g opacity="0.3">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                         <line
                            key={`line-${i}`}
                            x1="250" y1="250"
                            x2={250 + Math.cos(deg * (Math.PI / 180)) * 240}
                            y2={250 + Math.sin(deg * (Math.PI / 180)) * 240}
                            stroke={color}
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                          />
                    ))}
                </g>
            </svg>
        </motion.div>
    )
});
FungiTopoColor.displayName = "FungiTopoColor";

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[100dvh] text-center px-4 overflow-hidden bg-[#050505]">
      
      <StaticNoise />

      {/* VECTORES DE HONGOS */}
      <div className="absolute top-[-10%] left-[-20%] md:left-[-10%] w-[120vw] md:w-[60vw] h-[120vw] md:h-[60vw] pointer-events-none opacity-20 select-none">
          <FungiTopoColor color="#d97706" duration={60} />
      </div>
      
      <div className="absolute bottom-[-10%] right-[-20%] md:right-[-10%] w-[120vw] md:w-[60vw] h-[120vw] md:h-[60vw] pointer-events-none opacity-20 select-none">
          <FungiTopoColor color="#fcd34d" duration={80} reverse />
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="relative z-10 flex flex-col items-center mix-blend-normal transform-gpu"> 
        
        {/* Etiqueta Técnica */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6 md:mb-10 border border-white/10 px-4 py-1 rounded-full backdrop-blur-md bg-black/20"
        >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-amber-100/60 font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase">
                Bioseta Research Lab ©
            </span>
        </motion.div>

        {/* TÍTULO PRINCIPAL */}
        <div className="relative">
            <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans font-black text-[3.5rem] leading-[0.9] md:text-[9rem] tracking-tighter text-white uppercase relative z-20"
            >
                BIOSETA <br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                    EVOLUCIÓN
                </span>
            </motion.h1>
            
            {/* --- SOLUCIÓN: ELIMINÉ EL DIV DE FONDO NEGRO AQUÍ --- */}
            {/* Antes había un <div> con gradiente que causaba el recuadro negro feo. Ya no está. */}
        </div>

        {/* SUBTÍTULO */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-mono text-amber-500/80 text-[10px] md:text-xs tracking-[0.2em] uppercase max-w-[280px] md:max-w-md mx-auto mt-8 md:mt-12 bg-black/40 backdrop-blur-sm p-2 rounded border border-white/5"
        >
          [ Nootrópicos & Adaptógenos ]
        </motion.p>
      </div>

      {/* SCROLL & DATA */}
      <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-end text-white/20 font-mono text-[9px] uppercase tracking-widest pointer-events-none">
          <span className="hidden md:block">Lat: 6.2442° N</span>
          
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 60 }} 
            transition={{ delay: 1.5, duration: 1.5 }}
            className="w-[1px] bg-amber-500/50 absolute left-1/2 bottom-0"
          />

          <span className="hidden md:block">Lon: 75.5812° W</span>
      </div>

    </section>
  );
};