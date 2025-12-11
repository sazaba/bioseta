import { Navbar } from "@/components/layout/Navbar"; // Recuerda que este ya lo movimos al layout, si ya lo hiciste, bórralo de aquí
import { Hero } from "@/components/sections/Hero";
import { ProductCatalog } from "@/components/sections/ProductCatalog"; // <--- Importar
import { ScienceSection } from "@/components/sections/ScienceSection";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      
      {/* Fondo Texturizado Global (Se mantiene igual) */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0" 
           style={{
             backgroundImage: `linear-gradient(45deg, #ffffff 1px, transparent 1px), 
                               linear-gradient(-45deg, #ffffff 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* 1. Portada */}
      <Hero />

      {/* Science: La Autoridad y Confianza (El "Por qué") */}
      <ScienceSection />

      {/* 2. El Catálogo Editorial */}
      <ProductCatalog />

    </main>
  );
}