import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/admin/orders/OrdersTable";

type SP = {
  from?: string;
  to?: string;
  status?: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const where: any = {};

  if (sp.from || sp.to) {
    where.createdAt = {};
    if (sp.from) where.createdAt.gte = new Date(`${sp.from}T00:00:00`);
    if (sp.to) where.createdAt.lte = new Date(`${sp.to}T23:59:59`);
  }

  if (sp.status && sp.status !== "all") {
    where.status = sp.status;
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

  const safeOrders = orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    status: o.status,
    total: String(o.total),
    quantity: o.quantity,
    fullName: o.fullName,
    phone: o.phone,
    city: o.city,
    productName: o.product?.name ?? null,
  }));

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-4">
        Pedidos
      </h1>

      <OrdersTable orders={safeOrders} statuses={statuses} />
    </div>
  );
}
