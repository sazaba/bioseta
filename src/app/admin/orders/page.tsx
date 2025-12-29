import { prisma } from "@/lib/prisma";

export default async function OrdersAdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      product: { select: { name: true } },
    },
  });

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-white">Pedidos</h1>
        <p className="text-white/60 text-sm">Últimos 200 pedidos</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
        <table className="w-full text-sm">
          <thead className="text-white/70">
            <tr className="border-b border-white/10">
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Ciudad</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">ID</th>
            </tr>
          </thead>

          <tbody className="text-white/90">
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5">
                <td className="p-3 whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleString("es-CO")}
                </td>
                <td className="p-3">{o.product?.name ?? "—"}</td>
                <td className="p-3">
                  <div className="font-medium">{o.fullName}</div>
                  <div className="text-white/60">{o.phone}</div>
                </td>
                <td className="p-3">{o.city}</td>
                <td className="p-3">
                  ${Number(o.total).toLocaleString("es-CO")}
                </td>
                <td className="p-3">{o.status}</td>
                <td className="p-3 text-white/60">#{o.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
