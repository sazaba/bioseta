"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LuxuryLogo } from "@/components/LuxuryLogo"; // Asegúrate que la ruta sea correcta

const MENU_ITEMS = [
  { title: "La Colección", href: "#", subtitle: "Nuestros Extractos" },
  { title: "Ciencia", href: "#", subtitle: "Estudios & Evidencia" },
  { title: "Filosofía", href: "#", subtitle: "Nuestra Historia" },
  { title: "Shop", href: "#", subtitle: "Adquirir Ahora" }, // Shop ahora vive aquí
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar el fondo del navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear el scroll del body cuando el menú está abierto
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
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 transition-all duration-500 ${
          scrolled || isOpen ? "bg-[#0F1115]/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        }`}
      >
        {/* 1. LOGO (Visible siempre) */}
        <Link href="/" className="relative z-50 group">
           {/* Logo optimizado: se achica un poco al hacer scroll */}
           <LuxuryLogo className={`transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-12 h-12'} group-hover:scale-110`} />
        </Link>

        {/* 2. BOTÓN MENÚ HAMBURGUESA "PREMIUM" */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex items-center gap-4 text-amber-100/80 hover:text-amber-400 transition-colors group"
        >
          {/* Texto "MENÚ" que desaparece en móviles muy pequeños para ahorrar espacio */}
          <span className="hidden md:block text-[10px] font-sans font-bold tracking-[0.3em] uppercase">
            {isOpen ? "Cerrar" : "Menú"}
          </span>

          {/* Icono Animado Customizado */}
          <div className="flex flex-col gap-[6px] w-8 items-end">
            <motion.span 
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-8 h-[1px] bg-current block transition-transform origin-center"
            />
             {/* La línea del medio desaparece al abrir */}
            <motion.span 
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-[1px] bg-current block group-hover:w-8 transition-all duration-300"
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-8 h-[1px] bg-current block transition-transform origin-center"
            />
          </div>
        </button>
      </motion.nav>

      {/* 3. OVERLAY DEL MENÚ COMPLETO (La Magia) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-[#0F1115] flex flex-col items-center justify-center"
          >
            {/* Fondo decorativo sutil */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/40 via-[#0F1115] to-[#0F1115]"></div>

            {/* Lista de Enlaces */}
            <div className="flex flex-col gap-8 md:gap-12 text-center relative z-10">
              {MENU_ITEMS.map((item, index) => (
                <div key={item.title} className="overflow-hidden">
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={() => setIsOpen(false)}
                      className="group block"
                    >
                      {/* Subtítulo pequeño */}
                      <span className="block text-[10px] font-sans tracking-[0.4em] text-amber-500/50 uppercase mb-2 group-hover:text-amber-400 transition-colors">
                        0{index + 1} — {item.subtitle}
                      </span>
                      {/* Título Gigante Serif */}
                      <span 
                        className="text-4xl md:text-7xl text-stone-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-200 group-hover:to-amber-600 transition-all duration-500"
                        style={{ fontFamily: 'var(--font-cinzel)' }}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Footer del Menú */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 left-0 right-0 text-center"
            >
              <p className="text-[10px] font-sans text-stone-600 tracking-[0.3em] uppercase">
                Bioseta © 2025
              </p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};