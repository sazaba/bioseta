import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductManager } from "@/components/admin/ProductManager";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: Number(session.userId) },
  });

  if (!user) redirect("/admin/login");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    // CORRECCIÓN 1: 'pt-36' (Padding Top) para bajar el contenido y que no choque con el Navbar
    <main className="min-h-screen bg-[#050505] pt-36 pb-12 px-6 md:px-12 relative">
      
      {/* Fondo de ruido */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER DEL DASHBOARD */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            
            {/* CORRECCIÓN 2: Quitamos el <LuxuryLogo /> de aquí porque ya está en el Navbar fijo de arriba */}
            
            <div>
              <h1 className="text-white font-serif text-3xl tracking-wide">
                PANEL DE CONTROL
              </h1>
              <div className="flex items-center gap-3 mt-2">
                 <span className="text-stone-500 text-xs font-mono uppercase tracking-widest">
                    Hola, {user.name}
                 </span>
                 <span className="px-2 py-0.5 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-[9px] font-mono tracking-widest uppercase">
                    ● Conectado
                 </span>
              </div>
            </div>
          </div>
        </header>

        {/* COMPONENTE PRINCIPAL (Tu tabla con alertas Dark Mode) */}
        <ProductManager products={products} />
        
      </div>
    </main>
  );
}