import { Hero } from "../components/sections/Hero";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      
      {/* Fondo Texturizado Global */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0" 
           style={{
             backgroundImage: `linear-gradient(45deg, #ffffff 1px, transparent 1px), 
                               linear-gradient(-45deg, #ffffff 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Ya no ponemos <Navbar /> aquí, porque está en layout */}
      <Hero />

      {/* Próximamente: <ProductShowcase /> */}

    </main>
  );
}