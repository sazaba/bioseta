"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LuxuryLogo } from "@/components/LuxuryLogo"; 

const MENU_ITEMS = [
  { title: "La Colección", href: "#", subtitle: "Nuestros Extractos" },
  { title: "Ciencia", href: "#", subtitle: "Estudios & Evidencia" },
  { title: "Filosofía", href: "#", subtitle: "Nuestra Historia" },
  { title: "Shop", href: "#", subtitle: "Adquirir Ahora" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20); // Detecta scroll más rápido
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        // --- AQUÍ ESTÁ LA MAGIA DEL GLASSMORPHISM IOS ---
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 ${
          scrolled || isOpen 
            ? "bg-[#0a0a0a]/40 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* 1. LOGO */}
        <Link href="/" className="relative z-50 group">
           <LuxuryLogo className={`transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'} group-hover:scale-110 drop-shadow-md`} />
        </Link>

        {/* 2. BOTÓN MENÚ */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex items-center gap-3 md:gap-4 text-white/90 hover:text-amber-400 transition-colors group"
        >
          <span className="hidden md:block text-[10px] font-sans font-bold tracking-[0.3em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
            {isOpen ? "Cerrar" : "Menú"}
          </span>

          <div className="flex flex-col gap-[5px] w-8 items-end p-1">
            <motion.span 
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[1.5px] bg-current block transition-transform origin-center rounded-full"
            />
            <motion.span 
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-4 h-[1.5px] bg-current block group-hover:w-6 transition-all duration-300 rounded-full"
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-[1.5px] bg-current block transition-transform origin-center rounded-full"
            />
          </div>
        </button>
      </motion.nav>

      {/* 3. OVERLAY MENÚ (También con toque Glass oscuro profundo) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center supports-[backdrop-filter]:bg-[#050505]/80"
          >
            {/* Fondo con ruido sutil para textura premium */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            <div className="flex flex-col gap-10 md:gap-12 text-center relative z-10">
              {MENU_ITEMS.map((item, index) => (
                <div key={item.title} className="overflow-hidden">
                  <motion.div
                    initial={{ y: 50, opacity: 0, rotateX: -20 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={() => setIsOpen(false)}
                      className="group block relative"
                    >
                      <span className="block text-[9px] font-sans tracking-[0.4em] text-white/30 uppercase mb-1 group-hover:text-amber-500 transition-colors">
                        0{index + 1} — {item.subtitle}
                      </span>
                      <span 
                        className="text-4xl md:text-7xl text-white/90 group-hover:text-white transition-all duration-500 block"
                        style={{ fontFamily: 'var(--font-cinzel)' }}
                      >
                        {item.title}
                      </span>
                      {/* Línea decorativa al hover */}
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-amber-500 group-hover:w-1/2 transition-all duration-500 ease-out"></span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
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