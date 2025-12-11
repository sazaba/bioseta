"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { LuxuryLogo } from "@/components/LuxuryLogo"; 
import Image from "next/image";

// --- DATOS ---
const MENU_ITEMS = [
  { 
    title: "Collection", 
    href: "#", 
    subtitle: "Nuestros Extractos",
    img: "https://images.unsplash.com/photo-1615485925694-a69ea5bd9350?q=80&w=1920&auto=format&fit=crop" 
  },
  { 
    title: "Science", 
    href: "#", 
    subtitle: "Estudios & Evidencia",
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1920&auto=format&fit=crop"
  },
  { 
    title: "Philosophy", 
    href: "#", 
    subtitle: "Nuestra Historia",
    img: "https://images.unsplash.com/photo-1500468770786-91e8bf244b75?q=80&w=1920&auto=format&fit=crop"
  },
  { 
    title: "Shop", 
    href: "#", 
    subtitle: "Adquirir Ahora",
    img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=1920&auto=format&fit=crop"
  },
];

// --- COMPONENTE MAGNÉTICO (Desactivado en móviles visualmente para evitar bugs de touch) ---
const MagneticWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const ySpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        x.set((clientX - (left + width / 2)) * 0.3);
        y.set((clientY - (top + height / 2)) * 0.3);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring }}
            className={`hidden md:block ${className}`} // Solo magnético en desktop
        >
            {/* Fallback para móvil (sin magnético) */}
            <div className="md:hidden contents">{children}</div>
            {/* Versión desktop (con magnético) */}
            <div className="hidden md:block">{children}</div>
        </motion.div>
    );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll al abrir menú
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-12 transition-all duration-500 mix-blend-difference text-white ${
          scrolled && !isOpen ? "py-4" : "py-6 md:py-8"
        }`}
      >
        {/* LOGO */}
        <div className="relative z-[70]">
            <Link href="/" onClick={() => setIsOpen(false)}>
                <LuxuryLogo className={`transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'}`} />
            </Link>
        </div>

        {/* BOTÓN MENÚ */}
        <div onClick={() => setIsOpen(!isOpen)} className="relative z-[70] cursor-pointer group">
           <MagneticWrapper>
                <div className="flex items-center gap-4 p-2">
                    <span className="hidden md:block text-[11px] font-bold tracking-[0.2em] uppercase">
                        {isOpen ? "Close" : "Menu"}
                    </span>
                    <div className="flex flex-col gap-[5px] items-end w-8">
                        <motion.span 
                            animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                            className="w-8 h-[2px] bg-white block transition-all origin-center"
                        />
                         <motion.span 
                            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-5 h-[2px] bg-white block transition-all group-hover:w-8"
                        />
                        <motion.span 
                            animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                            className="w-8 h-[2px] bg-white block transition-all origin-center"
                        />
                    </div>
                </div>
           </MagneticWrapper>
        </div>
      </motion.nav>

      {/* OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            // USA h-[100dvh] PARA EVITAR SALTOS EN MOBILE SAFARI
            className="fixed inset-0 z-50 bg-[#080808] flex flex-col justify-between h-[100dvh] pt-24 pb-10 px-6 md:px-12"
          >
            {/* FONDO IMAGEN (Solo Desktop Hover) */}
            <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none filter saturate-0 md:saturate-50 transition-all duration-700">
               <AnimatePresence mode="popLayout">
                   {hoveredIndex !== null && (
                       <motion.div
                           key={hoveredIndex}
                           initial={{ opacity: 0, scale: 1.1 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute inset-0 hidden md:block" // Oculto en móvil para performance
                       >
                           <Image src={MENU_ITEMS[hoveredIndex].img} alt="bg" fill className="object-cover" />
                           <div className="absolute inset-0 bg-black/60" />
                       </motion.div>
                   )}
               </AnimatePresence>
            </div>

            {/* RUIDO DE FONDO (Textura Premium constante) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-10" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* CONTENIDO MENÚ */}
            <div className="flex flex-col justify-center flex-grow z-20 space-y-2 md:space-y-0">
              {MENU_ITEMS.map((item, index) => (
                <motion.div 
                    key={item.title} 
                    className="relative overflow-hidden group w-full md:text-center md:py-2"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                >
                    <Link 
                      href={item.href} 
                      onClick={() => setIsOpen(false)}
                      className="flex items-baseline gap-4 md:block"
                    >
                      {/* Número (Solo móvil para estructura) */}
                      <span className="md:hidden text-xs font-mono text-amber-500/80">0{index + 1}</span>

                      {/* TIPOGRAFÍA RESPONSIVA: text-[13vw] asegura que siempre quepa */}
                      <span 
                        className="text-[13vw] md:text-8xl lg:text-9xl font-black uppercase text-white/90 md:text-transparent md:bg-clip-text md:bg-gradient-to-b md:from-white md:to-white/40 group-hover:to-white transition-all leading-[0.9] tracking-tighter"
                      >
                        {item.title}
                      </span>
                    </Link>
                    
                    {/* Subtítulo (Móvil debajo, Desktop flotante) */}
                    <div className="pl-8 md:pl-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-xs md:text-sm text-stone-400 font-serif italic">{item.subtitle}</span>
                    </div>
                    
                    {/* Línea divisoria solo móvil */}
                    <div className="w-full h-[1px] bg-white/10 mt-2 md:hidden" />
                </motion.div>
              ))}
            </div>

            {/* FOOTER MOBILE OPTIMIZED */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end text-white/40 z-20 font-mono text-[10px] uppercase tracking-widest gap-4"
            >
                <div className="flex flex-col gap-1">
                    <span>Bioseta HQ</span>
                    <span>Bogotá, Colombia</span>
                </div>
                <div className="flex gap-6 text-white">
                    <a href="#">Insta</a>
                    <a href="#">LinkedIn</a>
                </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};