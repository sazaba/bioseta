import { Hero } from "@/components/sections/Hero";
import { PaymentSection } from "@/components/sections/PaymentSection";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { ScienceSection } from "@/components/sections/ScienceSection";
import { prisma } from "@/lib/prisma"; // 1. Importamos Prisma

// Hacemos el componente async para poder pedir datos
export default async function Home() {
  
  // 2. Pedimos solo los productos ACTIVOS a la base de datos
  // Los ordenamos para que los nuevos salgan primero
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
      
      <Hero />
      <ScienceSection />
      
      {/* 3. Le pasamos los productos reales al catálogo */}
      <ProductCatalog products={products} />
      
      <PaymentSection />

    </main>
  );
}