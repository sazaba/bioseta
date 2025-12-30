"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { deleteOrder } from "@/actions/orders";
import {
  CalendarDays,
  Filter,
  Trash2,
  X,
  Clock,
} from "lucide-react";

type OrderRow = {
  id: number;
  createdAt: string;
  status: string | null;
  total: string | number;
  quantity: number;
  fullName: string;
  phone: string;
  city: string;
  productName: string | null;
};

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn";
}) {
  const cls =
    tone === "good"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : tone === "warn"
      ? "border-red-500/30 bg-red-500/10 text-red-200"
      : "border-white/10 bg-white/5 text-white/80";

  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${cls}`}>
      {children}
    </span>
  );
}

export default function OrdersTable({
  orders,
  statuses,
}: {
  orders: OrderRow[];
  statuses: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const status = searchParams.get("status") || "all";

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => router.replace(pathname);

  const statusTone = (s: string | null) => {
    const v = (s || "").toLowerCase();
    if (["pagado", "entregado", "completed"].includes(v)) return "good";
    if (["cancelado", "fallido"].includes(v)) return "warn";
    return "neutral";
  };

  const onDelete = (id: number) => {
    if (!confirm("¿Eliminar esta orden? Se devolverá el stock.")) return;

    startTransition(async () => {
      const res = await deleteOrder(id);
      if (!res?.ok) alert(res?.message || "Error al eliminar");
      router.refresh();
    });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("es-CO");

  return (
    <div className="space-y-4">
      {/* FILTROS */}
      <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
          <div className="flex items-center gap-2">
            <Filter className="text-indigo-300" size={18} />
            <p className="font-black text-white">Filtros</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:ml-auto w-full lg:w-auto">
            <input
              type="date"
              value={from}
              onChange={(e) => setParam("from", e.target.value)}
              className="input"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setParam("to", e.target.value)}
              className="input"
            />
            <select
              value={status}
              onChange={(e) => setParam("status", e.target.value)}
              className="input"
            >
              <option value="all">Todos</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={clearFilters}
            className="ml-auto text-xs font-bold text-white/70 hover:text-white flex items-center gap-1"
          >
            <X size={14} /> Limpiar
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block rounded-3xl border border-white/10 bg-black/40 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="p-4 text-left">Fecha</th>
              <th className="p-4 text-left">Producto</th>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Ciudad</th>
              <th className="p-4 text-left">Cant.</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">{formatDate(o.createdAt)}</td>
                <td className="p-4 font-semibold">{o.productName}</td>
                <td className="p-4">
                  <div>{o.fullName}</div>
                  <div className="text-white/50 text-xs">{o.phone}</div>
                </td>
                <td className="p-4">{o.city}</td>
                <td className="p-4">{o.quantity}</td>
                <td className="p-4 font-black">
                  ${Number(o.total).toLocaleString("es-CO")}
                </td>
                <td className="p-4">
                  <Badge tone={statusTone(o.status)}>
                    {o.status || "—"}
                  </Badge>
                </td>
                <td className="p-4 text-white/50">#{o.id}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onDelete(o.id)}
                    disabled={isPending}
                    className="text-red-300 hover:text-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-3xl border border-white/10 bg-black/40 p-4"
          >
            <div className="flex justify-between gap-2">
              <div>
                <p className="text-xs text-white/60">{formatDate(o.createdAt)}</p>
                <p className="font-black">{o.productName}</p>
                <p className="text-xs text-white/60">
                  {o.fullName} • {o.phone}
                </p>
              </div>
              <Badge tone={statusTone(o.status)}>{o.status}</Badge>
            </div>

            <div className="mt-3 flex justify-between">
              <p className="font-black">
                ${Number(o.total).toLocaleString("es-CO")}
              </p>
              <button
                onClick={() => onDelete(o.id)}
                className="text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
