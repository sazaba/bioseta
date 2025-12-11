import Link from "next/link";
import { LuxuryLogo } from "@/components/LuxuryLogo";
import { getSession, logout } from "@/lib/session"; // Importamos logout y getSession
import { LogoutButton } from "./LogoutButton"

// Enlaces simplificados
const LINKS = {
  shop: ["Melena de León", "Ashwagandha", "Cordyceps", "Focus Blend"],
  legal: ["Términos & Condiciones", "Política de Privacidad", "Envíos y Devoluciones"]
};

export const Footer = async () => {
  // 1. Verificamos si hay sesión
  const session = await getSession();
  const isLoggedIn = !!session; // true si existe, false si no

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP SECTION: MARCA & MANIFIESTO */}
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

        {/* MIDDLE SECTION: GRID SIMPLIFICADO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-16 mb-16">
           {/* ... (Las columnas de enlaces quedan IGUAL que antes) ... */}
           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Colección</h4>
              <ul className="flex flex-col gap-3">
                 {LINKS.shop.map(item => (
                    <li key={item}>
                       <Link href="#" className="text-stone-400 hover:text-white text-xs font-sans uppercase tracking-widest transition-colors">{item}</Link>
                    </li>
                 ))}
              </ul>
           </div>
           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Legal</h4>
              <ul className="flex flex-col gap-3">
                 {LINKS.legal.map(item => (
                    <li key={item}>
                       <Link href="#" className="text-stone-400 hover:text-white text-xs font-sans uppercase tracking-widest transition-colors">{item}</Link>
                    </li>
                 ))}
              </ul>
           </div>
           <div>
              <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-6 opacity-50">Contacto</h4>
              <div className="flex gap-4">
                 <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">IG</Link>
                 <Link href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">WA</Link>
              </div>
              <p className="mt-6 text-stone-500 text-xs font-sans">medellin@bioseta.com.co</p>
           </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT & ADMIN INTELIGENTE */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] font-mono text-stone-600 uppercase tracking-widest">
           <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
              <p>© 2025 Bioseta Research Lab.</p>
              <p>Diseñado en Medellín, Colombia.</p>
           </div>
           
           {/* LÓGICA DE ACCESO */}
           <div className="flex gap-6 mt-4 md:mt-0 items-center">
             {isLoggedIn ? (
               <>
                 <Link 
                   href="/admin/dashboard" 
                   className="text-amber-500 hover:text-amber-300 transition-colors font-bold"
                 >
                   Ir al Dashboard
                 </Link>
                 <LogoutButton />
               </>
             ) : (
               <Link 
                 href="/admin/login" 
                 className="text-stone-800 hover:text-amber-500 transition-colors"
               >
                 Acceso Administrador
               </Link>
             )}
           </div>
        </div>

      </div>
    </footer>
  );
};