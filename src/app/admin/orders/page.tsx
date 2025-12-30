import { prisma } from "@/lib/prisma";
import OrdersTable, { type OrderRow } from "@/components/admin/orders/OrdersTable";

type SP = {
  from?: string;
  to?: string;
  status?: string;
  q?: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const where: any = {};

  // Filtro por fechas (server)
  if (sp.from || sp.to) {
    where.createdAt = {};
    if (sp.from) where.createdAt.gte = new Date(`${sp.from}T00:00:00`);
    if (sp.to) where.createdAt.lte = new Date(`${sp.to}T23:59:59`);
  }

  // Filtro por estado (server)
  if (sp.status && sp.status !== "all") {
    where.status = sp.status;
  }

  // (Opcional) búsqueda server por "q" (si prefieres dejarlo solo client, borra este bloque)
  if (sp.q?.trim()) {
    const q = sp.q.trim();
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { product: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: { select: { name: true } } },
  });

  const statusesRaw = await prisma.order.findMany({
    select: { status: true },
    distinct: ["status"],
  });

  const statuses = statusesRaw
    .map((s) => s.status)
    .filter(Boolean) as string[];

  // ✅ Normalización EXACTA al tipo OrderRow que espera OrdersTable
  const safeOrders: OrderRow[] = orders.map((o) => {
    const qty = Number(o.quantity || 0);
    const unitPrice = Number(o.unitPrice ?? 0); // Decimal -> number
    const total = Number(o.total ?? unitPrice * qty);

    return {
      id: o.id,
      createdAt: o.createdAt.toISOString(),
      status: (o.status as any) ?? "pendiente",
      productName: o.product?.name ?? "—",
      fullName: o.fullName,
      phone: o.phone,
      city: o.city,
      quantity: qty,
      unitPrice,
      total,
    };
  });

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-4">
        Pedidos
      </h1>

      <OrdersTable orders={safeOrders} statuses={statuses} />
    </div>
  );
}
