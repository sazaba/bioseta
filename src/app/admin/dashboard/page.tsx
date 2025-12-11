import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LuxuryLogo } from "@/components/LuxuryLogo";
import { prisma } from "@/lib/prisma";
import { ProductManager } from "@/components/admin/ProductManager"; // Importar el componente nuevo

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: Number(session.userId) },
  });

  if (!user) redirect("/admin/login");

  // 1. OBTENER PRODUCTOS DE LA DB (Ordenados por fecha)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-[#050505] p-6 md:p-12 relative">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER SIMPLE */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <LuxuryLogo className="w-12 h-12" />
            <div>
              <h1 className="text-white font-serif text-2xl">PANEL DE CONTROL</h1>
              <p className="text-stone-500 text-xs font-mono uppercase">Hola, {user.name}</p>
            </div>
          </div>
          <div className="px-4 py-1 bg-green-900/20 border border-green-500/30 rounded-full text-green-500 text-[10px] font-mono tracking-widest uppercase">
            ● Sistema Activo
          </div>
        </header>

        {/* COMPONENTE PRINCIPAL DE GESTIÓN */}
        <ProductManager products={products} />
        
      </div>
    </main>
  );
}