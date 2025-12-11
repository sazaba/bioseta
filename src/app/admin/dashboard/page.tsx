import Link from "next/link"; // <--- Importamos Link
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductManager } from "@/components/admin/ProductManager";
import { LuLogOut, LuArrowLeft } from "react-icons/lu"; // Iconos

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
    // Ya no necesitamos tanto padding-top porque no hay Navbar fijo tapando
    <main className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 md:px-12 relative">
      
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER CON BOTÓN VOLVER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8 gap-6">
          
          {/* Lado Izquierdo: Título */}
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

          {/* Lado Derecho: Botones de Acción */}
          <div className="flex items-center gap-4">
            
            {/* BOTÓN VOLVER A LA TIENDA */}
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-stone-400 hover:bg-white hover:text-black transition-colors"
            >
              <LuArrowLeft /> Ir al Inicio
            </Link>

          </div>
        </header>

        {/* COMPONENTE PRINCIPAL */}
        <ProductManager products={products} />
        
      </div>
    </main>
  );
}