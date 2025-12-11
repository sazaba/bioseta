"use client";
import Link from "next/link";
import { LuxuryLogo } from "@/components/LuxuryLogo";

// Enlaces simplificados
const LINKS = {
  shop: ["Melena de León", "Ashwagandha", "Cordyceps", "Focus Blend"],
  legal: ["Términos & Condiciones", "Política de Privacidad", "Envíos y Devoluciones"]
};

export const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP SECTION: MARCA & MANIFIESTO (Ahora centrado o con más aire) */}
        <div className="mb-24 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
               <LuxuryLogo className="w-10 h-10" />
               <span className="text-xl font-serif text-white tracking-widest">BIOSETA</span>
            </div>
            <h3 className="text-2xl md:text-4xl text-white font-sans font-black uppercase tracking-tight leading-tight mb-6">
              DISEÑAMOS ACTUALIZACIONES <br /> 
              <span className="text-amber-500">BIOLÓGICAS.</span>
            </h3>
            <p className="text-stone-400 font-serif italic text-lg leading-relaxed max-w-lg">
              "No vendemos simples suplementos. Entregamos las herramientas moleculares para que recuperes tu soberanía mental y física."
            </p>
        </div>

        {/* MIDDLE SECTION: GRID SIMPLIFICADO (3 Columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-16 mb-16">
           
           {/* Columna 1: Colección (Futuros anclajes) */}
           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">
                Colección
              </h4>
              <ul className="flex flex-col gap-3">
                 {LINKS.shop.map(item => (
                    <li key={item}>
                       <Link href="#" className="text-stone-400 hover:text-white text-xs font-sans uppercase tracking-widest transition-colors">
                          {item}
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Columna 2: Legal (Pendientes por crear) */}
           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">
                Legal
              </h4>
              <ul className="flex flex-col gap-3">
                 {LINKS.legal.map(item => (
                    <li key={item}>
                       <Link href="#" className="text-stone-400 hover:text-white text-xs font-sans uppercase tracking-widest transition-colors">
                          {item}
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Columna 3: Social / Contacto */}
           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">
                Contacto
              </h4>
              <div className="flex gap-4">
                 <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    IG
                 </Link>
                 <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    WA
                 </Link>
              </div>
              <p className="mt-6 text-stone-500 text-xs font-sans">
                medellin@bioseta.com.co
              </p>
           </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] font-mono text-stone-600 uppercase tracking-widest">
           <p>© 2025 Bioseta Research Lab.</p>
           <p className="mt-2 md:mt-0">Diseñado en Medellín, Colombia.</p>
        </div>

      </div>
    </footer>
  );
};