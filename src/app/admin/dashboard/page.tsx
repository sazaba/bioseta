import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LuArrowLeft, LuPackage, LuShoppingBag } from "react-icons/lu";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: Number(session.userId) },
  });

  if (!user) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 md:px-12 relative">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8 gap-6">
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

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-stone-400 hover:bg-white hover:text-black transition-colors"
            >
              <LuArrowLeft /> Ir al Inicio
            </Link>
          </div>
        </header>

        {/* HUB: BOTONES GRANDES */}
        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/dashboard/products"
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
                  Gestión
                </div>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Productos
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Crear, editar, activar/desactivar y administrar catálogo.
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center text-white/80 group-hover:bg-black/50">
                <LuPackage size={22} />
              </div>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/orders"
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/60 font-mono uppercase tracking-widest">
                  Ventas
                </div>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Pedidos
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Ver pedidos, estado, datos del cliente y seguimiento.
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center text-white/80 group-hover:bg-black/50">
                <LuShoppingBag size={22} />
              </div>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
