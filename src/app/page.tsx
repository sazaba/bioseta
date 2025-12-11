import { LuxuryLogo } from "@/components/LuxuryLogo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0F1115] p-6 relative overflow-hidden">
      
      {/* Fondo sutil tipo ajedrez oscuro (como en tu ejemplo) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(45deg, #1a1a1a 25%, transparent 25%), 
                               linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), 
                               linear-gradient(45deg, transparent 75%, #1a1a1a 75%), 
                               linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)`,
             backgroundSize: '20px 20px'
           }}>
      </div>

      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full flex justify-between items-center p-8 z-50">
        <span className="text-amber-500/50 text-xs tracking-[0.3em]">EST. 2025</span>
        <button className="text-xs font-medium tracking-[0.2em] text-amber-100/80 border border-amber-900/30 px-6 py-2 rounded-sm hover:bg-amber-900/20 transition-colors uppercase">
          Shop
        </button>
      </nav>

      {/* EL LOGO NUEVO - Aquí es donde brilla */}
      <div className="z-10 mt-10">
        <LuxuryLogo className="w-[350px] h-[350px] md:w-[500px] md:h-[500px]" />
      </div>

      <div className="text-center z-10 -mt-10">
        <p className="font-sans text-amber-100/40 text-sm tracking-[0.3em] uppercase mb-8">
          Extractos Adaptógenos Ultra-Premium
        </p>
      </div>

    </main>
  );
}