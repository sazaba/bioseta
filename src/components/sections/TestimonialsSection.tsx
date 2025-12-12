"use client";
import { motion } from "framer-motion";
import Image from "next/image";

// --- DATOS DE PRUEBA (Reemplaza con capturas reales después) ---
const TESTIMONIALS = [
  {
    id: 1,
    name: "Ana María",
    role: "Cliente Verificado",
    message: "Llevo 2 semanas con la Melena de León y mi concentración en el trabajo es otro nivel. ¡Gracias Bioseta! 🍄✨",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "10:42 AM"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    role: "Biohacker",
    message: "El Cordyceps me cambió los entrenamientos. Recuperación rapidísima y cero fatiga mental.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "Yesterday"
  },
  {
    id: 3,
    name: "Sofía L.",
    role: "Estudiante",
    message: "Estaba súper estresada por la tesis. El Ashwagandha me ayudó a dormir como un bebé. 100% recomendado.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    time: "9:15 AM"
  },
  {
    id: 4,
    name: "Dr. Felipe G.",
    role: "Médico",
    message: "Impresionado con la calidad de sus extractos. Se nota la pureza desde el primer día.",
    avatar: "https://randomuser.me/api/portraits/men/85.jpg",
    time: "11:20 AM"
  },
  // Duplicamos para efecto infinito si son pocos
  {
    id: 5,
    name: "Valentina",
    role: "Cliente Verificado",
    message: "¡El envío a Bogotá fue rapidísimo! El empaque es hermoso, se siente muy premium.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    time: "2:30 PM"
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

      {/* --- MARQUEE DESKTOP / SCROLL MÓVIL --- */}
      <div className="relative w-full overflow-hidden">
        
        {/* GRADIENTES LATERALES (Para suavizar la entrada/salida) */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

        {/* CONTENEDOR MÓVIL (Grid Vertical) */}
        <div className="md:hidden flex flex-col gap-4 px-4">
            {TESTIMONIALS.map((t) => (
                <ChatBubble key={t.id} data={t} />
            ))}
        </div>

        {/* CONTENEDOR DESKTOP (Animación Marquee) */}
        <div className="hidden md:flex flex-col gap-6">
            {/* FILA 1: Izquierda a Derecha */}
            <Marquee direction="left">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                    <ChatBubble key={`${t.id}-1-${i}`} data={t} />
                ))}
            </Marquee>
            
            {/* FILA 2: Derecha a Izquierda */}
            <Marquee direction="right">
                {[...TESTIMONIALS, ...TESTIMONIALS].reverse().map((t, i) => (
                    <ChatBubble key={`${t.id}-2-${i}`} data={t} />
                ))}
            </Marquee>
        </div>

      </div>

    </section>
  );
};

// --- COMPONENTE BURBUJA DE CHAT (Estilo iPhone Dark Mode) ---
const ChatBubble = ({ data }: { data: typeof TESTIMONIALS[0] }) => (
  <div className="w-full md:w-[350px] flex-shrink-0 p-4 rounded-2xl bg-[#1a1a1a]/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition-colors group">
    
    {/* Header Chat */}
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

    {/* Mensaje */}
    <div className="relative bg-[#262626] rounded-xl rounded-tl-none p-3 text-stone-300 text-xs leading-relaxed border border-white/5">
        {data.message}
        {/* Triangulito de chat */}
        <div className="absolute top-0 left-[-6px] w-0 h-0 border-t-[6px] border-t-[#262626] border-l-[6px] border-l-transparent" />
    </div>

  </div>
);

// --- COMPONENTE MARQUEE (Animación Infinita) ---
const Marquee = ({ children, direction = "left" }: { children: React.ReactNode, direction?: "left" | "right" }) => {
    return (
        <div className="flex overflow-hidden w-full group">
            <motion.div
                initial={{ x: direction === "left" ? 0 : "-50%" }}
                animate={{ x: direction === "left" ? "-50%" : 0 }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                className="flex gap-6 flex-shrink-0 px-3 group-hover:[animation-play-state:paused]"
            >
                {children}
            </motion.div>
        </div>
    );
};