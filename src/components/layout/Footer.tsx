"use client";
import Link from "next/link";
import { LuxuryLogo } from "@/components/LuxuryLogo";

const LINKS = {
  shop: ["Melena de León", "Ashwagandha", "Cordyceps", "Focus Blend"],
  learn: ["Nuestra Ciencia", "El Proceso", "Blog", "FAQ"],
  legal: ["Términos & Condiciones", "Política de Privacidad", "Envíos y Devoluciones"]
};

export const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP SECTION: MANIFIESTO & BRAND */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          
          {/* Columna 1: Marca & Manifiesto */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
               <LuxuryLogo className="w-10 h-10" />
               <span className="text-xl font-serif text-white tracking-widest">BIOSETA</span>
            </div>
            <h3 className="text-2xl md:text-3xl text-white font-sans font-black uppercase tracking-tight leading-tight mb-6">
              DISEÑAMOS ACTUALIZACIONES <br /> 
              <span className="text-amber-500">BIOLÓGICAS.</span>
            </h3>
            <p className="text-stone-400 font-serif italic text-lg leading-relaxed">
              "No vendemos simples suplementos. Entregamos las herramientas moleculares para que recuperes tu soberanía mental y física."
            </p>
          </div>

          {/* Columna 2: Newsletter Minimalista */}
          <div className="w-full md:w-auto">
            <span className="text-xs font-mono text-amber-500 tracking-[0.3em] uppercase block mb-6">
              Únete al Círculo
            </span>
            <div className="flex flex-col gap-4">
               <div className="flex items-end gap-4 border-b border-white/20 pb-2 group focus-within:border-amber-500 transition-colors">
                  <input 
                    type="email" 
                    placeholder="TU CORREO ELECTRÓNICO" 
                    className="bg-transparent text-white font-sans text-xs tracking-widest uppercase w-64 md:w-80 outline-none placeholder:text-stone-600"
                  />
                  <button className="text-white hover:text-amber-400 transition-colors">→</button>
               </div>
               <p className="text-[10px] text-stone-600 font-sans uppercase tracking-wider">
                  * Ciencia, no spam.
               </p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: ENLACES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 border-t border-white/5 pt-16 mb-16">
           {/* Generamos las columnas de enlaces dinámicamente */}
           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Colección</h4>
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

           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Explorar</h4>
              <ul className="flex flex-col gap-3">
                 {LINKS.learn.map(item => (
                    <li key={item}>
                       <Link href="#" className="text-stone-400 hover:text-white text-xs font-sans uppercase tracking-widest transition-colors">
                          {item}
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>

           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Legal</h4>
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

           {/* Redes Sociales / Contacto */}
           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Social</h4>
              <div className="flex gap-4">
                 <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    IG
                 </Link>
                 <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    WA
                 </Link>
              </div>
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