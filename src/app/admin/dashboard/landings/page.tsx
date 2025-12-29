import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LuArrowLeft } from "react-icons/lu";
import LandingsList from "@/components/admin/landings/LandingsList";

export default async function LandingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: Number(session.userId) },
  });
  if (!user) redirect("/admin/login");

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  // ✅ Por ahora: solo 1 landing real (melena-de-leon)
  // (luego lo hacemos dinámico con slug)
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
}
