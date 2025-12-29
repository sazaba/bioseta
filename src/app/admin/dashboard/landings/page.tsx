import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LuArrowLeft, LuExternalLink, LuCopy } from "react-icons/lu";

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
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 md:px-12 relative">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HEADER */}
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

        {/* LISTADO */}
        <div className="grid gap-4">
          {products.map((p) => {
            // 🔴 Por ahora la landing está hardcodeada
            // Luego lo pasamos a slug dinámico
            const landingUrl = `/melena-de-leon`;

            return (
              <div
                key={p.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="text-sm font-semibold text-white">
                    {p.name}
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    {landingUrl}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={landingUrl}
                    target="_blank"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    <LuExternalLink size={14} />
                    Abrir
                  </Link>

                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_SITE_URL}${landingUrl}`
                      );
                    }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    <LuCopy size={14} />
                    Copiar
                  </button>
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/60">
              No hay landings activas.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
