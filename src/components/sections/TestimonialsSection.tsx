"use client";
import { motion } from "framer-motion";
import Image from "next/image";

// --- DATOS DE PRUEBA REALISTAS ---
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
    name: "Sofía L.",
    role: "Estudiante",
    message: "Estaba súper estresada por la tesis. El Ashwagandha me ayudó a dormir como un bebé. 100% recomendado.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
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
    avatar: "https://images.unsplash.com/photo-1627067227670-38379c299c51?auto=format&fit=crop&w=150&q=80",
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
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      
      {/* FONDO AMBIENTAL */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vw] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">
            Comunidad Bioseta
        </span>
        <h2 className="text-3xl md:text-5xl font-sans font-black text-white uppercase tracking-tighter">
            Resultados <span className="text-stone-500">Reales</span>
        </h2>
      </div>

      {/* --- MARQUEE INFINITO (Móvil & Desktop) --- */}
      <div className="relative w-full overflow-hidden">
        
        {/* GRADIENTES LATERALES */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

        <div className="flex flex-col gap-6">
            {/* FILA 1: Izquierda a Derecha (Lento) */}
            <Marquee direction="left" speed={40}>
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                    <ChatBubble key={`${t.id}-1-${i}`} data={t} />
                ))}
            </Marquee>
            
            {/* FILA 2: Derecha a Izquierda (Un poco más rápido) */}
            <Marquee direction="right" speed={35}>
                {[...TESTIMONIALS, ...TESTIMONIALS].reverse().map((t, i) => (
                    <ChatBubble key={`${t.id}-2-${i}`} data={t} />
                ))}
            </Marquee>
        </div>

      </div>

    </section>
  );
};

// --- COMPONENTE BURBUJA DE CHAT ---
const ChatBubble = ({ data }: { data: typeof TESTIMONIALS[0] }) => (
  // w-[280px] en móvil para que quepa bien, w-[350px] en escritorio
  <div className="w-[280px] md:w-[350px] flex-shrink-0 p-4 rounded-2xl bg-[#1a1a1a]/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition-colors group">
    
    <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                <Image src={data.avatar} alt={data.name} fill className="object-cover" />
            </div>
            <div>
                <h4 className="text-xs font-bold text-white leading-none">{data.name}</h4>
                <span className="text-[9px] text-amber-500 font-mono tracking-wider uppercase">{data.role}</span>
            </div>
        </div>
        <span className="text-[9px] text-stone-500">{data.time}</span>
    </div>

    <div className="relative bg-[#262626] rounded-xl rounded-tl-none p-3 text-stone-300 text-xs leading-relaxed border border-white/5">
        {data.message}
        <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[6px] border-t-[#262626] border-l-[6px] border-l-transparent" />
    </div>

  </div>
);

// --- COMPONENTE MARQUEE (Ajustado) ---
const Marquee = ({ children, direction = "left", speed = 40 }: { children: React.ReactNode, direction?: "left" | "right", speed?: number }) => {
    return (
        <div className="flex overflow-hidden w-full group select-none pointer-events-none md:pointer-events-auto">
            <motion.div
                initial={{ x: direction === "left" ? 0 : "-50%" }}
                animate={{ x: direction === "left" ? "-50%" : 0 }}
                transition={{ 
                    repeat: Infinity, 
                    duration: speed, // Velocidad configurable
                    ease: "linear" 
                }}
                className="flex gap-4 md:gap-6 flex-shrink-0 px-2 md:px-3"
            >
                {children}
            </motion.div>
        </div>
    );
};