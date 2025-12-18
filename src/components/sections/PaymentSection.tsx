"use client";
import { memo } from "react";
import { motion, Variants } from "framer-motion";

const TRUST_FEATURES = [
  {
    id: "pago-casa",
    title: "PAGO CONTRA ENTREGA",
    subtitle: "Cero Riesgos",
    description: "¿Prefieres ver para creer? Pide tu Bioseta hoy y paga en efectivo únicamente cuando el mensajero toque tu puerta.",
    type: "cash"
  },
  {
    id: "envios",
    title: "COBERTURA NACIONAL",
    subtitle: "Envíos Rápidos",
    description: "Llegamos a cada rincón de Colombia. Desde la Guajira hasta el Amazonas, tu paquete viaja asegurado y con número de rastreo.",
    type: "map"
  },
  {
    id: "mercadopago",
    title: "PAGOS BLINDADOS",
    subtitle: "Vía MercadoPago",
    description: "Aceptamos todas las tarjetas. Tu transacción está protegida con encriptación bancaria de alto nivel. Compra con total tranquilidad.",
    type: "card"
  }
];

// --- TEXTURA STATIC (Base64 ligero, sin peticiones http) ---
const StaticNoise = memo(() => (
  <div 
    className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: '120px 120px'
    }}
  />
));
StaticNoise.displayName = "StaticNoise";

export const PaymentSection = () => {
  return (
    <section className="relative bg-[#080a0c] py-24 px-4 overflow-hidden border-t border-white/5">
      
      {/* 1. FONDO SUTIL OPTIMIZADO (Gradiente vs Blur) */}
      {/* Antes: blur-[120px] (Costoso) -> Ahora: radial-gradient (Gratis para la GPU) */}
      <div 
        className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] pointer-events-none opacity-40"
        style={{
            background: 'radial-gradient(circle, rgba(22, 78, 99, 0.4) 0%, rgba(8, 10, 12, 0) 70%)'
        }}
      />
      
      {/* 2. TEXTURA OPTIMIZADA */}
      <StaticNoise />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }} // Margin ayuda a que cargue un poco antes
            className="text-3xl md:text-5xl text-white font-sans font-black uppercase tracking-tight"
          >
            COMPRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-500">SEGURA</span>
          </motion.h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* GRID HORIZONTAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {TRUST_FEATURES.map((item, index) => (
            <TrustCard key={item.id} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

// Componente separado para evitar re-renders
const TrustCard = memo(({ item, index }: { item: any, index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }} // Tiempos ajustados para sentirlo más "snappy"
      className="flex flex-col items-center text-center group will-change-transform"
    >
      {/* VISUAL VECTORIAL ANIMADO */}
      <div className="w-40 h-40 mb-6 relative flex items-center justify-center transform-gpu">
         {/* Glow Frío Optimizado (sin blur exagerado) */}
         <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors duration-500" />
         <TrustIcon type={item.type} />
      </div>

      <h3 className="text-xl text-white font-sans font-bold uppercase tracking-wider mb-2">
        {item.title}
      </h3>
      
      <span className="text-cyan-400 font-mono text-[10px] tracking-[0.2em] uppercase mb-4 block">
        [{item.subtitle}]
      </span>
      
      <p className="text-stone-400 font-sans text-sm leading-relaxed max-w-xs mx-auto">
        {item.description}
      </p>
    </motion.div>
  );
});
TrustCard.displayName = "TrustCard";

// --- ICONOS VECTORIALES "COLD TECH" ---
// Usamos memo para que no se recalculen los paths en cada render del padre
const TrustIcon = memo(({ type }: { type: string }) => {
  
  // Variantes movidas fuera o memoizadas es mejor práctica
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.2, ease: "easeInOut" }, // Un poco más rápido
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full stroke-cyan-200 fill-none stroke-[1.5] drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* 1. CONTRA ENTREGA */}
      {type === "cash" && (
        <>
           <motion.rect x="35" y="20" width="30" height="30" rx="2" variants={draw} />
           <motion.line x1="35" y1="35" x2="65" y2="35" variants={draw} className="stroke-cyan-500/50" />
           <motion.line x1="50" y1="20" x2="50" y2="50" variants={draw} className="stroke-cyan-500/50" />
           <motion.path 
             d="M20 70 C 20 70, 30 60, 45 60 H 55 C 70 60, 80 70, 80 70 V 90 H 20 V 70 Z" 
             variants={draw} 
             transition={{ delay: 0.3 }} // Delay reducido
           />
           <motion.circle cx="75" cy="45" r="5" variants={draw} transition={{ delay: 0.5 }} className="stroke-white fill-white/10 animate-bounce" />
        </>
      )}

      {/* 2. ENVÍOS */}
      {type === "map" && (
        <>
           <motion.path 
             d="M20 80 Q 40 20, 80 20" 
             variants={draw} 
             className="stroke-cyan-500 stroke-dashed"
             strokeDasharray="4 4"
           />
           <motion.circle cx="20" cy="80" r="3" variants={draw} fill="white" />
           <motion.path 
             d="M80 20 L 75 35 L 85 35 Z" 
             variants={draw} 
             transition={{ delay: 0.5 }}
             className="fill-cyan-200 stroke-none"
           />
           <motion.circle cx="80" cy="20" r="8" variants={draw} transition={{ delay: 0.3 }} />
           <motion.circle cx="80" cy="20" r="15" variants={draw} transition={{ delay: 0.6 }} className="stroke-cyan-500/30" />
        </>
      )}

      {/* 3. MERCADOPAGO */}
      {type === "card" && (
        <>
           <motion.rect x="15" y="30" width="70" height="45" rx="4" variants={draw} />
           <motion.line x1="15" y1="45" x2="85" y2="45" variants={draw} className="stroke-cyan-500 fill-cyan-500/20" strokeWidth="6" />
           <motion.rect x="25" y="55" width="15" height="10" rx="1" variants={draw} className="stroke-white/50" />
           <motion.path 
             d="M65 60 V 55 A 5 5 0 0 1 75 55 V 60" 
             variants={draw} 
             transition={{ delay: 0.4 }}
           />
           <motion.rect x="62" y="60" width="16" height="12" rx="2" variants={draw} transition={{ delay: 0.5 }} fill="#000" className="stroke-cyan-200" />
        </>
      )}
    </motion.svg>
  );
});
TrustIcon.displayName = "TrustIcon";