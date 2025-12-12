import Link from "next/link";
import { LuxuryLogo } from "@/components/LuxuryLogo";
import { getSession } from "@/lib/session";
import { LogoutButton } from "./LogoutButton";

// Enlaces con rutas reales
const LEGAL_LINKS = [
  { label: "Términos & Condiciones", href: "/terms" },
  { label: "Política de Privacidad", href: "/privacy" },
  { label: "Envíos y Devoluciones", href: "/shipping" }
];

export const Footer = async () => {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-24 pb-12 px-6 overflow-hidden relative">
      {/* Textura de fondo sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* TOP SECTION: MARCA & MANIFIESTO */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-8">
                   <LuxuryLogo className="w-10 h-10 text-white" />
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

            {/* SECCIÓN DERECHA: LEGAL & CONTACTO (Grid de 2 columnas) */}
            <div className="flex gap-16 md:gap-32 mt-8 md:mt-0">
                {/* Columna Legal */}
                <div>
                   <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Legal</h4>
                   <ul className="flex flex-col gap-4">
                      {LEGAL_LINKS.map((item) => (
                        <li key={item.label}>
                           <Link 
                             href={item.href} 
                             className="text-stone-400 hover:text-amber-400 text-xs font-sans uppercase tracking-widest transition-colors flex items-center gap-2 group"
                           >
                             {/* Pequeño punto que aparece al hacer hover */}
                             <span className="w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                             {item.label}
                           </Link>
                        </li>
                      ))}
                   </ul>
                </div>

                {/* Columna Contacto */}
                <div>
                   <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Contacto</h4>
                   <div className="flex gap-4 mb-6">
                      <Link href="https://instagram.com" target="_blank" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110">
                        IG
                      </Link>
                      <Link href="https://wa.link/gas7d2" target="_blank" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110">
                        WA
                      </Link>
                   </div>
                   <a href="mailto:medellin@bioseta.com.co" className="text-stone-500 hover:text-white text-xs font-sans transition-colors">
                     medellin@bioseta.com.co
                   </a>
                </div>
            </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] font-mono text-stone-600 uppercase tracking-widest">
           <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-center md:text-left">
              <p>© 2025 Bioseta Research Lab.</p>
              <p>Diseñado en Medellín, Colombia.</p>
           </div>
           
           <div className="flex gap-6 mt-4 md:mt-0 items-center">
             {isLoggedIn ? (
               <>
                 <Link href="/admin/dashboard" className="text-amber-500 hover:text-amber-300 transition-colors font-bold">
                   Dashboard
                 </Link>
                 <LogoutButton />
               </>
             ) : (
               <Link href="/admin/login" className="text-stone-800 hover:text-amber-500 transition-colors">
                 Admin
               </Link>
             )}
           </div>
        </div>

      </div>
    </footer>
  );
};