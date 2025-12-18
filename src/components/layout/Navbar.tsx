"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LuxuryLogo } from "@/components/LuxuryLogo"; 

const MENU_ITEMS = [
  { title: "Inicio", href: "#hero", subtitle: "Bienvenido a Bioseta" },
  { title: "Beneficios", href: "#science", subtitle: "¿Por qué funcionan?" },
  { title: "Productos", href: "#collection", subtitle: "Ver Catálogo Completo" },
  { title: "Testimonios", href: "#testimonials", subtitle: "Historias Reales" },
  { title: "Pagos", href: "#payment", subtitle: "Medios de Pago y Envíos" },
];

// --- SOLUCIÓN: TEXTURA ESTÁTICA (Cero consumo de CPU) ---
// Usamos una imagen base64 pequeña que se repite. Mucho más rápido que SVG Filter.
const BioTexture = () => (
  <div 
    className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '100px 100px' // Tamaño pequeño para repetir sin carga
    }}
  />
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Pequeña optimización: no actualizar el estado si no cambia el valor booleano
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    // Passive true mejora el rendimiento del scroll en móviles
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]); // Añadimos dependencia para comparar

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false); 

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300); 
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        // OPTIMIZACIÓN: Usamos will-change-transform para avisar al navegador
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500 will-change-transform ${
          scrolled || isOpen 
            ? "py-4 bg-[#050505]/85 backdrop-blur-md shadow-2xl" // Bajé de blur-xl a blur-md para móviles
            : "py-6 bg-transparent"
        }`}
      >
        {/* FONDO Y BORDE */}
        {/* Renderizado condicional para evitar pintar elementos invisibles */}
        <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none overflow-hidden ${scrolled || isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <BioTexture />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>

        {/* LOGO */}
        <Link 
            href="#hero" 
            onClick={(e) => handleNavClick(e, '#hero')} 
            className="relative z-50 group flex items-center"
        >
            {/* Solo renderizar el glow si está scrolleado para ahorrar GPU */}
            {scrolled && <div className="absolute inset-0 bg-black/50 blur-xl scale-150 rounded-full -z-10" />}
            <LuxuryLogo className={`text-white transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'} group-hover:scale-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]`} />
        </Link>

        {/* BOTÓN MENÚ */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex items-center gap-4 text-white hover:text-amber-400 transition-colors group"
          aria-label="Toggle Menu"
        >
          <span className="hidden md:block text-[10px] font-sans font-bold tracking-[0.3em] uppercase opacity-80 group-hover:opacity-100 transition-opacity pt-[2px]">
            {isOpen ? "Cerrar" : "Menú"}
          </span>
          <div className="flex flex-col gap-[6px] w-8 items-end p-1">
            <motion.span 
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-8 h-[1.5px] bg-current block transition-transform origin-center rounded-full"
            />
            <motion.span 
              animate={isOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
              className="w-5 h-[1.5px] bg-current block group-hover:w-8 transition-all duration-300 rounded-full"
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-8 h-[1.5px] bg-current block transition-transform origin-center rounded-full"
            />
          </div>
        </button>
      </motion.nav>

      {/* OVERLAY MENÚ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }} // Duración un poco más rápida para sensación de agilidad
            // backdrop-blur-3xl es MUY pesado. Lo bajé a xl o lg.
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center supports-[backdrop-filter]:bg-[#050505]/90"
          >
            {/* Textura estática en lugar del filtro SVG directo */}
            <div className="absolute inset-0 opacity-10">
                <BioTexture />
            </div>

            <div className="flex flex-col gap-8 md:gap-10 text-center relative z-10 w-full max-w-screen-xl px-4">
              {MENU_ITEMS.map((item, index) => (
                <div key={item.title} className="overflow-hidden">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }} // Quitamos skewY para mejorar rendimiento en móvil
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.5, ease: "easeOut" }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="group block relative"
                    >
                      <div className="flex items-center justify-center gap-3 mb-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-mono text-amber-500">0{index + 1}</span>
                          <span className="w-8 h-[1px] bg-white/20"></span>
                          <span className="text-[9px] font-serif italic text-stone-300 tracking-wider">
                            {item.subtitle}
                          </span>
                      </div>

                      <span 
                        className="text-5xl md:text-8xl text-white font-sans font-black uppercase tracking-tighter group-hover:text-amber-400 transition-colors duration-300 block leading-[0.9]"
                      >
                        {/* Eliminé el bg-clip-text en hover móvil para evitar repintados costosos, puedes dejarlo si es crítico */}
                        {item.title}
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-12 left-0 right-0 text-center"
            >
              <p className="text-[9px] font-sans text-white/20 tracking-[0.4em] uppercase">
                Bioseta © 2025
              </p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};