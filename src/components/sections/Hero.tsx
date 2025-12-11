"use client";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[100dvh] text-center px-4 overflow-hidden bg-[#050505]">
      
      {/* 1. TEXTURA DE GRANO (Para evitar el color plano) */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
      </div>

      {/* 2. VECTORES DE HONGOS (Topografía Animada) */}
      {/* Hongo Izquierdo - Girando suavemente */}
      <div className="absolute top-[-10%] left-[-20%] md:left-[-10%] w-[150vw] md:w-[60vw] h-[150vw] md:h-[60vw] pointer-events-none opacity-20">
         <FungiTopoColor color="#d97706" duration={60} />
      </div>
      
      {/* Hongo Derecho - Girando en sentido contrario */}
      <div className="absolute bottom-[-10%] right-[-20%] md:right-[-10%] w-[150vw] md:w-[60vw] h-[150vw] md:h-[60vw] pointer-events-none opacity-20">
         <FungiTopoColor color="#fcd34d" duration={80} reverse />
      </div>

      {/* 3. CONTENIDO CENTRAL */}
      <div className="relative z-10 flex flex-col items-center mix-blend-normal"> 
        
        {/* Etiqueta Técnica */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6 md:mb-10 border border-white/10 px-4 py-1 rounded-full backdrop-blur-md"
        >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-amber-100/60 font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase">
                Bioseta Research Lab ©
            </span>
        </motion.div>

        {/* TÍTULO MONTSERRAT BLACK (El mismo que te gustó) */}
        <div className="relative">
            {/* Sombra de texto para legibilidad sobre los vectores */}
            <motion.h1 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans font-black text-[3.5rem] leading-[0.9] md:text-[9rem] tracking-tighter text-white uppercase relative z-20"
            >
                ALQUIMIA <br />
                {/* Texto hueco (Stroke) para efecto moderno */}
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                    NATURAL
                </span>
            </motion.h1>
            
            {/* Capa de brillo detrás del texto "Natural" para que resalte */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-10 blur-xl"></div>
        </div>

        {/* SUBTÍTULO CIENTÍFICO */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-mono text-amber-500/80 text-[10px] md:text-xs tracking-[0.2em] uppercase max-w-xs md:max-w-md mx-auto mt-8 md:mt-12 bg-black/50 backdrop-blur-sm p-2 rounded border border-white/5"
        >
          [ Extractos de Espectro Completo ]
        </motion.p>
      </div>

      {/* 4. SCROLL & DATA */}
      <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-end text-white/20 font-mono text-[9px] uppercase tracking-widest">
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

// --- COMPONENTE SVG: Topografía de Hongo (Vector Draw) ---
// Dibuja anillos concéntricos irregulares que parecen un hongo visto desde arriba
const FungiTopoColor = ({ color, duration, reverse = false }: { color: string, duration: number, reverse?: boolean }) => {
    return (
        <motion.svg 
            viewBox="0 0 500 500" 
            fill="none" 
            className="w-full h-full"
            animate={{ rotate: reverse ? -360 : 360 }}
            transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
        >
            <defs>
                <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.1" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            
            {/* Anillos Irregulares (Topografía) */}
            {[...Array(6)].map((_, i) => (
                <path
                    key={i}
                    d={`M250,250 m-${50 + i * 35},0 a${50 + i * 35},${50 + i * 35} 0 1,0 ${100 + i * 70},0 a${50 + i * 35},${50 + i * 35} 0 1,0 -${100 + i * 70},0`}
                    // Deformamos un poco el círculo perfecto para que parezca orgánico
                    stroke={`url(#grad-${color})`}
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                    opacity={1 - i * 0.1}
                    // Animación sutil de "respiración" para cada anillo
                    style={{
                        transformOrigin: 'center',
                        scale: 1 + Math.sin(i) * 0.1
                    }}
                />
            ))}

            {/* Líneas radiales (como las branquias del hongo) */}
            {[...Array(12)].map((_, i) => (
                 <motion.line
                    key={`line-${i}`}
                    x1="250" y1="250"
                    x2={250 + Math.cos(i * 30 * (Math.PI / 180)) * 240}
                    y2={250 + Math.sin(i * 30 * (Math.PI / 180)) * 240}
                    stroke={color}
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                    strokeDasharray="4 4"
                 />
            ))}
        </motion.svg>
    )
}