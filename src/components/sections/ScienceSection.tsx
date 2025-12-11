"use client";
import { motion, Variants } from "framer-motion";

const FEATURES = [
  {
    id: "01",
    title: "POTENCIA PURA",
    subtitle: "Doble Extracción",
    description: "No es polvo de hongo molido, es un extracto concentrado. Usamos agua y alcohol para sacar el 100% de los nutrientes. Una dosis equivale a comer kilos de hongos.",
    type: "mushroom"
  },
  {
    id: "02",
    title: "ABSORCIÓN TOTAL",
    subtitle: "Nanotecnología",
    description: "Tu cuerpo no digiere los hongos crudos. Nuestra tecnología rompe las paredes celulares para que tu sangre absorba cada gramo de beneficio al instante.",
    type: "drop"
  },
  {
    id: "03",
    title: "ESTÁNDAR USA", // EL NUEVO PUNTO FUERTE
    subtitle: "100% Importado",
    description: "Olvídate de imitaciones genéricas. Traemos la materia prima directamente de los mejores laboratorios de Estados Unidos. Calidad certificada y pureza gringa.",
    type: "usa" // Nuevo tipo de icono
  }
];

export const ScienceSection = () => {
  return (
    <section className="relative bg-[#050505] py-24 md:py-32 px-4 overflow-hidden border-t border-white/5">
      
      {/* FONDO SUTIL */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-20 md:mb-28">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase block mb-6"
          >
            Calidad sin compromisos
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
            "La diferencia entre un suplemento local y Bioseta es la pureza del origen. Traemos lo mejor del mundo para ti."
          </p>
        </div>

        {/* GRID DE BENEFICIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
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
      {/* ICONO CON EFECTO GLOW */}
      <div className="w-48 h-48 mb-8 relative flex items-center justify-center">
         <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-500" />
         <PremiumIcon type={feature.type} />
      </div>

      <h3 className="text-2xl md:text-3xl text-white font-sans font-black uppercase tracking-tight mb-2">
        {feature.title}
      </h3>
      
      <span className="text-amber-500 font-serif italic text-sm mb-4 block border border-amber-500/30 px-3 py-1 rounded-full">
        {feature.subtitle}
      </span>
      
      <p className="text-stone-400 font-sans text-sm md:text-base leading-relaxed max-w-xs mx-auto">
        {feature.description}
      </p>
    </motion.div>
  );
};

// --- ICONOS VECTORIALES PREMIUM ---
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
      {/* 1. HONGO ESTILIZADO */}
      {type === "mushroom" && (
        <g transform="translate(50, 40) scale(0.5)">
           <motion.path 
             d="M100 20 C 160 20, 190 60, 190 90 C 190 120, 170 130, 150 130 L 50 130 C 30 130, 10 120, 10 90 C 10 60, 40 20, 100 20 Z" 
             variants={draw} 
           />
           <motion.path 
             d="M70 130 C 70 130, 60 180, 50 220 L 150 220 C 140 180, 130 130, 130 130" 
             variants={draw} 
             transition={{ delay: 0.5 }}
           />
           <motion.path d="M100 20 V 90" variants={draw} className="stroke-white/20" />
           <motion.path d="M60 40 L 100 90" variants={draw} className="stroke-white/20" />
           <motion.path d="M140 40 L 100 90" variants={draw} className="stroke-white/20" />
        </g>
      )}

      {/* 2. GOTA DE EXTRACTO */}
      {type === "drop" && (
        <g transform="translate(60, 40) scale(0.4)">
           <motion.path 
             d="M100 10 Q 150 80, 150 130 A 50 50 0 1 1 50 130 Q 50 80, 100 10 Z" 
             variants={draw} 
           />
           <motion.circle cx="100" cy="130" r="70" variants={draw} transition={{ delay: 0.5 }} className="stroke-amber-500/50 stroke-[2] stroke-dashed" />
           <motion.circle cx="100" cy="130" r="90" variants={draw} transition={{ delay: 0.8 }} className="stroke-amber-500/30 stroke-[1] stroke-dashed" />
        </g>
      )}

      {/* 3. BANDERA USA PREMIUM (Estilizada y Elegante) */}
      {type === "usa" && (
        <g transform="translate(40, 50) scale(0.6)">
           {/* El asta de la bandera */}
           <motion.line x1="10" y1="10" x2="10" y2="180" variants={draw} className="stroke-white/40 stroke-[2]" />
           
           {/* El contorno ondeante de la bandera */}
           <motion.path 
             d="M10 20 C 50 10, 90 30, 130 20 C 170 10, 210 30, 210 30 V 130 C 210 130, 170 110, 130 120 C 90 130, 50 110, 10 120" 
             variants={draw} 
             className="stroke-amber-200 stroke-[2]"
           />

           {/* El Cantón (Cuadro de las estrellas) */}
           <motion.rect x="10" y="20" width="80" height="50" variants={draw} className="stroke-amber-500/80 stroke-[1]" />
           
           {/* Estrellas Simplificadas (Puntos brillantes) */}
           <motion.circle cx="30" cy="35" r="2" fill="white" className="stroke-none animate-pulse" />
           <motion.circle cx="50" cy="35" r="2" fill="white" className="stroke-none animate-pulse" />
           <motion.circle cx="70" cy="35" r="2" fill="white" className="stroke-none animate-pulse" />
           <motion.circle cx="40" cy="55" r="2" fill="white" className="stroke-none animate-pulse" />
           <motion.circle cx="60" cy="55" r="2" fill="white" className="stroke-none animate-pulse" />

           {/* Franjas (Stripes) */}
           <motion.path d="M90 35 H 210" variants={draw} transition={{ delay: 0.5 }} className="stroke-white/20" />
           <motion.path d="M90 55 H 210" variants={draw} transition={{ delay: 0.6 }} className="stroke-white/20" />
           <motion.path d="M10 85 H 200" variants={draw} transition={{ delay: 0.7 }} className="stroke-white/20" />
           <motion.path d="M10 105 H 200" variants={draw} transition={{ delay: 0.8 }} className="stroke-white/20" />
        </g>
      )}
    </motion.svg>
  );
};