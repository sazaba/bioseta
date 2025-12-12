import { Hero } from "@/components/sections/Hero";
import { PaymentSection } from "@/components/sections/PaymentSection";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { ScienceSection } from "@/components/sections/ScienceSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"; // 1. Importamos
import { prisma } from "@/lib/prisma"; 

export default async function Home() {
  
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

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
      
      <section id="hero">
        <Hero />
      </section>

      <section id="science">
        <ScienceSection />
      </section>
      
      <section id="collection">
        <ProductCatalog products={products} />
      </section>

      {/* 2. NUEVA SECCIÓN TESTIMONIOS (ID opcional si no la enlazas en el menú) */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      
      <section id="payment">
        <PaymentSection />
      </section>

    </main>
  );
}