import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LuArrowLeft } from "react-icons/lu";
import OrdersTable from "@/components/admin/orders/OrdersTable";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: Number(session.userId) },
  });
  if (!user) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: { select: { name: true } } },
  });

  /**
   * ✅ NORMALIZACIÓN IMPORTANTE
   * Prisma devuelve Decimal → lo convertimos a number/string
   * para que coincida con OrderRow del componente client
   */
  const normalizedOrders = orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(), // string seguro
    status: o.status ?? null,
    productName: o.product?.name ?? "—",
    fullName: o.fullName,
    phone: o.phone,
    city: o.city,
    quantity: o.quantity,
    unitPrice: Number(o.unitPrice),
    total: Number(o.total),
  }));

  /**
   * Estados únicos para el filtro
   */
  const statuses = Array.from(
    new Set(orders.map((o) => o.status).filter(Boolean))
  ) as string[];

  return (
    <main className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 md:px-12 relative">
      {/* Noise background */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'url("https://grainy-gradients.vercel.app/noise.svg")',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-white font-serif text-2xl tracking-wide">
              Pedidos
            </h1>
            <p className="text-stone-500 text-xs font-mono uppercase tracking-widest mt-2">
              Últimos 200 pedidos
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-xs font-bold uppercase tracking-widest text-stone-400 hover:bg-white hover:text-black transition-colors"
          >
            <LuArrowLeft /> Volver al Panel
          </Link>
        </header>

        {/* TABLA */}
        <OrdersTable orders={normalizedOrders} statuses={statuses} />
      </div>
    </main>
  );
}
