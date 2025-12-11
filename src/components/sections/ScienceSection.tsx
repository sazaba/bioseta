"use client";
import { motion, Variants } from "framer-motion";

const FEATURES = [
  {
    id: "01",
    title: "POTENCIA PURA", // Marketero: Directo al beneficio
    subtitle: "Doble Extracción",
    description: "No es polvo de hongo, es un extracto concentrado. Usamos agua y alcohol para sacar el 100% de los nutrientes. Una dosis equivale a comer kilos de hongos.",
    type: "mushroom" // Icono visual de hongo
  },
  {
    id: "02",
    title: "ABSORCIÓN TOTAL", // Marketero: Resuelve el miedo de "¿esto si funciona?"
    subtitle: "Bio-Disponibilidad",
    description: "Tu cuerpo no digiere los hongos crudos. Nuestra tecnología 'Nano-Bana' rompe las paredes celulares para que absorbas cada gramo de beneficio al instante.",
    type: "drop" // Icono de gota/absorción
  },
  {
    id: "03",
    title: "SOLO LO BUENO", // Marketero: Confianza y limpieza
    subtitle: "Cero Rellenos",
    description: "Sin arroz, sin granos, sin 'aserrín'. Solo el cuerpo fructífero del hongo (la parte medicinal). Lo que ves es pureza al 100%.",
    type: "shield" // Icono de escudo/pureza
  }
];

export const ScienceSection = () => {
  return (
    <section className="relative bg-[#050505] py-24 md:py-32 px-4 overflow-hidden border-t border-white/5">
      
      {/* FONDO SUTIL (Luz ambiental) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER: CLARO Y DIRECTO */}
        <div className="text-center mb-20 md:mb-28">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase block mb-6"
          >
            ¿Por qué Bioseta?
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl text-white font-sans font-black uppercase tracking-tight leading-tight max-w-3xl mx-auto"
          >
            NO ES MAGIA, ES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
              CIENCIA APLICADA.
            </span>
          </motion.h2>
          
          <p className="mt-6 text-stone-400 font-serif italic text-lg md:text-xl max-w-2xl mx-auto">
            "La diferencia entre un suplemento normal y Bioseta es la cantidad de medicina que realmente llega a tu sangre."
          </p>
        </div>

        {/* GRID DE BENEFICIOS VISUALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      className="flex flex-col items-center text-center group"
    >
      {/* ICONO PREMIUM ANIMADO (El Centro de Atención) */}
      <div className="w-48 h-48 mb-8 relative flex items-center justify-center">
         {/* Fondo Glow detrás del icono */}
         <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-500" />
         
         {/* El SVG Vectorial Premium */}
         <PremiumIcon type={feature.type} />
      </div>

      <h3 className="text-2xl md:text-3xl text-white font-sans font-black uppercase tracking-tight mb-2">
        {feature.title}
      </h3>
      
      <span className="text-amber-500 font-serif italic text-sm mb-4 block">
        — {feature.subtitle}
      </span>
      
      <p className="text-stone-400 font-sans text-sm md:text-base leading-relaxed max-w-xs mx-auto">
        {feature.description}
      </p>
    </motion.div>
  );
};

// --- ICONOS VECTORIALES PREMIUM (SVG DIBUJADOS A MANO) ---
const PremiumIcon = ({ type }: { type: string }) => {
  
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full stroke-amber-200 fill-none stroke-[1.5] drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* 1. HONGO ESTILIZADO (Para "Potencia Pura") */}
      {type === "mushroom" && (
        <g transform="translate(50, 40) scale(0.5)">
           {/* Sombrero del hongo */}
           <motion.path 
             d="M100 20 C 160 20, 190 60, 190 90 C 190 120, 170 130, 150 130 L 50 130 C 30 130, 10 120, 10 90 C 10 60, 40 20, 100 20 Z" 
             variants={draw} 
           />
           {/* Tallo */}
           <motion.path 
             d="M70 130 C 70 130, 60 180, 50 220 L 150 220 C 140 180, 130 130, 130 130" 
             variants={draw} 
             transition={{ delay: 0.5 }}
           />
           {/* Detalles internos (branquias) */}
           <motion.path d="M100 20 V 90" variants={draw} className="stroke-white/20" />
           <motion.path d="M60 40 L 100 90" variants={draw} className="stroke-white/20" />
           <motion.path d="M140 40 L 100 90" variants={draw} className="stroke-white/20" />
        </g>
      )}

      {/* 2. GOTA DE EXTRACTO (Para "Absorción") */}
      {type === "drop" && (
        <g transform="translate(60, 40) scale(0.4)">
           {/* Gota principal */}
           <motion.path 
             d="M100 10 Q 150 80, 150 130 A 50 50 0 1 1 50 130 Q 50 80, 100 10 Z" 
             variants={draw} 
           />
           {/* Ondas de expansión (absorción) */}
           <motion.circle cx="100" cy="130" r="70" variants={draw} transition={{ delay: 0.5 }} className="stroke-amber-500/50 stroke-[2] stroke-dashed" />
           <motion.circle cx="100" cy="130" r="90" variants={draw} transition={{ delay: 0.8 }} className="stroke-amber-500/30 stroke-[1] stroke-dashed" />
        </g>
      )}

      {/* 3. ESCUDO / CÉLULA (Para "Solo lo Bueno") */}
      {type === "shield" && (
        <g transform="translate(50, 50) scale(0.5)">
           {/* Escudo externo */}
           <motion.path 
             d="M100 10 L 180 50 V 120 C 180 170, 100 220, 100 220 C 100 220, 20 170, 20 120 V 50 L 100 10 Z" 
             variants={draw} 
           />
           {/* Checkmark interno (Validación) */}
           <motion.path 
             d="M60 110 L 90 140 L 140 80" 
             variants={draw} 
             transition={{ delay: 0.5 }}
             className="stroke-amber-400 stroke-[4]"
           />
        </g>
      )}
    </motion.svg>
  );
};