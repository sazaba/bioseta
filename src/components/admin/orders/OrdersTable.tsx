"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/order-status";

type OrderRow = {
  id: number;
  createdAt: Date | string;
  status: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  total: any;
  product?: { name: string } | null;
};

export default function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [items, setItems] = useState<OrderRow[]>(orders);
  const [isPending, startTransition] = useTransition();

  function setStatus(orderId: number, status: string) {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, status);
      if (!res.ok) return;

      setItems((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    });
  }

  return (
    <div className="w-full">
      {/* MOBILE: CARDS */}
      <div className="md:hidden space-y-3">
        {items.map((o) => (
          <div
            key={o.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-white/60">
                  {new Date(o.createdAt).toLocaleString("es-CO")}
                </div>
                <div className="mt-1 text-base font-semibold text-white">
                  {o.product?.name ?? "—"}
                </div>
                <div className="mt-2 text-sm text-white/80">
                  {o.fullName}
                </div>
                <div className="text-sm text-white/60">{o.phone}</div>
              </div>

              <div className="text-right">
                <StatusBadge status={o.status} />
                <div className="mt-3 text-xs text-white/60">Total</div>
                <div className="text-lg font-semibold">
                  ${Number(o.total).toLocaleString("es-CO")}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs text-white/60">Entrega</div>
              <div className="mt-1 text-sm text-white/80">{o.city}</div>
              <div className="text-sm text-white/60">{o.address}</div>
              <div className="mt-2 text-xs text-white/50">Pedido #{o.id}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {o.status === "nuevo" && (
                <ActionBtn
                  disabled={isPending}
                  onClick={() => setStatus(o.id, "en_proceso")}
                >
                  Pasar a En proceso
                </ActionBtn>
              )}

              {o.status === "en_proceso" && (
                <ActionBtn
                  disabled={isPending}
                  onClick={() => setStatus(o.id, "enviado")}
                >
                  Marcar Enviado
                </ActionBtn>
              )}

              {o.status === "enviado" && (
                <ActionBtn
                  disabled={isPending}
                  onClick={() => setStatus(o.id, "entregado")}
                >
                  Marcar Entregado
                </ActionBtn>
              )}

              {o.status !== "cancelado" && o.status !== "entregado" && (
                <ActionBtn
                  danger
                  disabled={isPending}
                  onClick={() => setStatus(o.id, "cancelado")}
                >
                  Cancelar
                </ActionBtn>
              )}
            </div>

            {isPending ? (
              <div className="mt-3 text-xs text-white/50">Actualizando...</div>
            ) : null}
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/60">
            Aún no hay pedidos.
          </div>
        )}
      </div>

      {/* DESKTOP: TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
        <table className="w-full text-sm">
          <thead className="text-white/70">
            <tr className="border-b border-white/10">
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Ciudad</th>
              <th className="p-3 text-left">Dirección</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-white/90">
            {items.map((o) => (
              <tr key={o.id} className="border-b border-white/5 align-top">
                <td className="p-3 whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleString("es-CO")}
                </td>
                <td className="p-3">{o.product?.name ?? "—"}</td>
                <td className="p-3">
                  <div className="font-medium">{o.fullName}</div>
                  <div className="text-white/60">{o.phone}</div>
                </td>
                <td className="p-3">{o.city}</td>
                <td className="p-3">{o.address}</td>
                <td className="p-3">
                  ${Number(o.total).toLocaleString("es-CO")}
                </td>
                <td className="p-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {o.status === "nuevo" && (
                      <ActionBtn
                        disabled={isPending}
                        onClick={() => setStatus(o.id, "en_proceso")}
                      >
                        Pasar a En proceso
                      </ActionBtn>
                    )}

                    {o.status === "en_proceso" && (
                      <ActionBtn
                        disabled={isPending}
                        onClick={() => setStatus(o.id, "enviado")}
                      >
                        Marcar Enviado
                      </ActionBtn>
                    )}

                    {o.status === "enviado" && (
                      <ActionBtn
                        disabled={isPending}
                        onClick={() => setStatus(o.id, "entregado")}
                      >
                        Marcar Entregado
                      </ActionBtn>
                    )}

                    {o.status !== "cancelado" && o.status !== "entregado" && (
                      <ActionBtn
                        danger
                        disabled={isPending}
                        onClick={() => setStatus(o.id, "cancelado")}
                      >
                        Cancelar
                      </ActionBtn>
                    )}
                  </div>

                  {isPending ? (
                    <div className="mt-2 text-xs text-white/50">
                      Actualizando...
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="p-6 text-white/60" colSpan={8}>
                  Aún no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    nuevo: "bg-white/10 text-white/80 border-white/10",
    en_proceso: "bg-yellow-500/10 text-yellow-200 border-yellow-500/20",
    enviado: "bg-blue-500/10 text-blue-200 border-blue-500/20",
    entregado: "bg-green-500/10 text-green-200 border-green-500/20",
    cancelado: "bg-red-500/10 text-red-200 border-red-500/20",
  };

  const cls = map[status] ?? "bg-white/10 text-white/70 border-white/10";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${cls}`}
    >
      {status}
    </span>
  );
}

function ActionBtn({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-2xl border px-3 py-2 text-xs font-semibold transition",
        // Mobile-friendly tap target:
        "min-h-[42px]",
        danger
          ? "border-red-500/30 bg-red-500/10 text-red-100 hover:bg-red-500/20"
          : "border-white/10 bg-black/30 text-white/80 hover:bg-white/10",
        disabled ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}
