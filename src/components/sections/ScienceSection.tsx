"use client";
import { motion, Variants } from "framer-motion"; // <--- Importamos Variants

const FEATURES = [
  {
    id: "01",
    title: "DOBLE EXTRACCIÓN",
    description: "Proceso alquímico de 8 semanas. Alcohol para triterpenos, agua caliente para beta-glucanos. Espectro completo garantizado.",
    type: "circle"
  },
  {
    id: "02",
    title: "100% CUERPO FRUCTÍFERO",
    description: "Sin micelio en grano, sin almidones, sin rellenos. Solo el hongo real, cultivado en maderas nobles y cosechado a mano.",
    type: "hexagon"
  },
  {
    id: "03",
    title: "BIO-DISPONIBILIDAD",
    description: "Nanotecnología aplicada para romper la pared celular de quitina (Nano-bana), asegurando una absorción celular inmediata.",
    type: "diamond"
  }
];

export const ScienceSection = () => {
  return (
    <section className="relative bg-[#050505] py-32 px-4 overflow-hidden border-t border-white/5">
      
      {/* FONDO TÉCNICO (Grid) */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER DE LA SECCIÓN */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-amber-500 font-mono text-xs tracking-[0.3em] uppercase block mb-4"
            >
              Metodología
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl text-white font-sans font-black tracking-tighter uppercase leading-none"
            >
              ESTÁNDAR <br />
              <span className="text-white/20">CLÍNICO</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-stone-400 font-serif italic text-lg max-w-md text-right hidden md:block"
          >
            "La pureza no es un accidente, es el resultado de la intención inteligente."
          </motion.p>
        </div>

        {/* GRID DE CARACTERÍSTICAS (Diagramas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 border-t border-white/10 pt-16">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

// TARJETA DE CARACTERÍSTICA CON GRÁFICO ANIMADO
const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      className="flex flex-col group"
    >
      {/* 1. VISUALIZACIÓN TÉCNICA (El "Gráfico") */}
      <div className="h-48 w-full border border-white/5 bg-white/[0.02] mb-8 relative flex items-center justify-center overflow-hidden rounded-sm group-hover:border-amber-500/30 transition-colors duration-500">
         <TechShape type={feature.type} />
         
         {/* Etiqueta de datos flotante */}
         <div className="absolute top-4 right-4 text-[9px] font-mono text-white/30 tracking-widest">
            FIG. 0{index + 1}
         </div>
      </div>

      {/* 2. TEXTO */}
      <span className="text-amber-500 font-mono text-xs mb-4 block">0{index + 1}</span>
      <h3 className="text-2xl text-white font-sans font-bold uppercase tracking-tight mb-4 group-hover:text-amber-100 transition-colors">
        {feature.title}
      </h3>
      <p className="text-stone-400 font-sans text-sm leading-relaxed opacity-80 max-w-xs">
        {feature.description}
      </p>
    </motion.div>
  );
};

// COMPONENTE DE FIGURAS TÉCNICAS ANIMADAS (SVG)
const TechShape = ({ type }: { type: string }) => {
  
  // CORRECCIÓN: Tipamos explícitamente como 'Variants'
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, ease: "easeInOut" },
        opacity: { duration: 0.01 }
      }
    }
  };

  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="stroke-amber-500/80 stroke-[0.5] fill-none drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
    >
      {type === "circle" && (
        <>
          <motion.circle cx="50" cy="50" r="40" variants={draw} />
          <motion.circle cx="50" cy="50" r="25" variants={draw} transition={{ delay: 0.5 }} className="stroke-white/30" />
          <motion.line x1="50" y1="10" x2="50" y2="90" variants={draw} className="stroke-white/10" />
          <motion.line x1="10" y1="50" x2="90" y2="50" variants={draw} className="stroke-white/10" />
        </>
      )}
      
      {type === "hexagon" && (
        <>
          <motion.path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" variants={draw} />
          <motion.path d="M50 30 L65 40 L65 60 L50 70 L35 60 L35 40 Z" variants={draw} transition={{ delay: 0.5 }} className="stroke-white/30" />
          <motion.circle cx="50" cy="50" r="2" fill="white" className="stroke-none animate-pulse" />
        </>
      )}

      {type === "diamond" && (
        <>
          <motion.rect x="50" y="20" width="42" height="42" transform="rotate(45 50 50)" variants={draw} />
          <motion.rect x="50" y="35" width="21" height="21" transform="rotate(45 50 50)" variants={draw} transition={{ delay: 0.5 }} className="stroke-white/30" />
          {/* Líneas de conexión */}
          <motion.line x1="50" y1="0" x2="50" y2="20" variants={draw} className="stroke-white/20" />
          <motion.line x1="50" y1="80" x2="50" y2="100" variants={draw} className="stroke-white/20" />
        </>
      )}
    </motion.svg>
  );
};