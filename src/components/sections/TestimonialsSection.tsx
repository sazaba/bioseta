"use client";
import { memo } from "react";
import { motion } from "framer-motion";

// --- TEXTURA STATIC (Base64 ligero) ---
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

const TESTIMONIALS = [
  {
    id: 1,
    name: "Ana María",
    role: "Cliente Verificado",
    message: "Llevo 2 semanas con la Melena de León y mi concentración en el trabajo es otro nivel. ¡Gracias Bioseta! 🍄✨",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=150&q=80",
    time: "10:42 AM"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    role: "Biohacker",
    message: "El Cordyceps me cambió los entrenamientos. Recuperación rapidísima y cero fatiga mental.",
    avatar: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=150&q=80", 
    time: "Ayer"
  },
  {
    id: 3,
    name: "Manuela G.",
    role: "Jubilada",
    message: "Estaba sufriendo de insomnio. El Ashwagandha me ayudó a dormir como un bebé. 100% recomendado mijo.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    time: "9:15 AM"
  },
  {
    id: 4,
    name: "Andrés G.",
    role: "Ingeniero",
    message: "Impresionado con la calidad de sus extractos. Se nota la pureza desde el primer día.",
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80",
    time: "11:20 AM"
  },
  {
    id: 5,
    name: "Valentina",
    role: "Cliente Verificado",
    message: "¡El envío a Medellín fue rapidísimo! El empaque es hermoso, se siente muy premium.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80",
    time: "2:30 PM"
  },
  {
    id: 6,
    name: "Julián D.",
    role: "Deportista",
    message: "La energía que me da esto no es normal. Ya no dependo tanto del café.",
    avatar: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=150&q=80",
    time: "1:15 PM"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden border-t border-white/5">
      
      {/* 1. FONDO AMBIENTAL OPTIMIZADO (Sin Blur costoso) */}
      <StaticNoise />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vw] pointer-events-none opacity-20"
        style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)'
        }}
      />

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">
            Comunidad Bioseta
        </span>
        <h2 className="text-3xl md:text-5xl font-sans font-black text-white uppercase tracking-tighter">
            Resultados <span className="text-stone-500">Reales</span>
        </h2>
      </div>

      {/* --- MARQUEE INFINITO --- */}
      <div className="relative w-full overflow-hidden">
        
        {/* GRADIENTES LATERALES (Optimizados para usar CSS puro) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

        <div className="flex flex-col gap-6">
            <Marquee direction="left" speed={50}>
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                    <ChatBubble key={`${t.id}-1-${i}`} data={t} />
                ))}
            </Marquee>
            
            <Marquee direction="right" speed={45}>
                {[...TESTIMONIALS, ...TESTIMONIALS].reverse().map((t, i) => (
                    <ChatBubble key={`${t.id}-2-${i}`} data={t} />
                ))}
            </Marquee>
        </div>

      </div>

    </section>
  );
};

// --- COMPONENTE BURBUJA DE CHAT (Memoizado) ---
const ChatBubble = memo(({ data }: { data: typeof TESTIMONIALS[0] }) => (
  // CAMBIO CLAVE: Quitamos 'backdrop-blur-md' y usamos bg sólido oscuro.
  // Esto hace que el navegador mueva un "bloque sólido" en lugar de recalcular píxeles translúcidos.
  <div className="w-[280px] md:w-[350px] flex-shrink-0 p-4 rounded-2xl bg-[#111] border border-white/10 hover:border-amber-500/30 transition-colors group will-change-transform">
    
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-stone-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={data.avatar} 
                    alt={data.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                    width="32" 
                    height="32"
                />
            </div>
            <div>
                <h4 className="text-xs font-bold text-white leading-none">{data.name}</h4>
                <span className="text-[9px] text-amber-500 font-mono tracking-wider uppercase">{data.role}</span>
            </div>
        </div>
        <span className="text-[9px] text-stone-500">{data.time}</span>
    </div>

    <div className="relative bg-[#222] rounded-xl rounded-tl-none p-3 text-stone-300 text-xs leading-relaxed border border-white/5">
        {data.message}
        {/* El triángulo CSS es perfecto, no consume recursos */}
        <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[6px] border-t-[#222] border-l-[6px] border-l-transparent" />
    </div>

  </div>
));
ChatBubble.displayName = "ChatBubble";

// --- COMPONENTE MARQUEE (Optimizado con will-change) ---
const Marquee = memo(({ children, direction = "left", speed = 40 }: { children: React.ReactNode, direction?: "left" | "right", speed?: number }) => {
    return (
        <div className="flex overflow-hidden w-full group select-none pointer-events-none md:pointer-events-auto">
            <motion.div
                initial={{ x: direction === "left" ? 0 : "-50%" }}
                animate={{ x: direction === "left" ? "-50%" : 0 }}
                transition={{ 
                    repeat: Infinity, 
                    duration: speed, 
                    ease: "linear" 
                }}
                // CLAVE: will-change-transform avisa a la GPU que esto se moverá siempre
                className="flex gap-4 md:gap-6 flex-shrink-0 px-2 md:px-3 will-change-transform"
            >
                {children}
            </motion.div>
        </div>
    );
});
Marquee.displayName = "Marquee";