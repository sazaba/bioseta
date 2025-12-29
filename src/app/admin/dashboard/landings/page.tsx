import Link from "next/link";
import { redirect } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import LandingsList from "@/components/admin/LandingsList";

export const dynamic = "force-dynamic";

export default async function LandingsPage() {
  try {
    const session = await getSession();
    if (!session) redirect("/admin/login");

    const user = await prisma.user.findUnique({
      where: { id: Number(session.userId) },
      select: { id: true, name: true },
    });
    if (!user) redirect("/admin/login");

    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    });

    // ✅ Por ahora: 1 landing real
    const items = products.map((p) => ({
      id: p.id,
      name: p.name,
      url: "/melena-de-leon",
    }));

    return (
      <main className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 md:px-12 relative">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-white font-serif text-2xl tracking-wide">
                Landings activas
              </h1>
              <p className="text-stone-500 text-xs font-mono uppercase tracking-widest mt-2">
                Enlaces públicos para campañas
              </p>
            </div>

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-stone-400 hover:bg-white hover:text-black transition-colors"
            >
              <LuArrowLeft /> Volver al Panel
            </Link>
          </header>

          <LandingsList items={items} />
        </div>
      </main>
    );
  } catch (e) {
    // ✅ fallback: nunca tumba el admin
    return (
      <main className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 md:px-12">
        <div className="max-w-3xl mx-auto rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
          <div className="text-lg font-semibold">Error cargando Landings</div>
          <p className="mt-2 text-sm text-red-200/80">
            Esta ruta lanzó un error en el servidor. Revisa logs en Vercel para ver el detalle.
          </p>

          <div className="mt-4">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-stone-200 hover:bg-white hover:text-black transition-colors"
            >
              <LuArrowLeft /> Volver al Panel
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
