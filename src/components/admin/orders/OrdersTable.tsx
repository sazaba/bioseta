"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteOrder } from "@/actions/orders";
import {
  CalendarDays,
  Filter,
  Search,
  Trash2,
  X,
  Package,
  User,
  MapPin,
  Hash,
} from "lucide-react";

export type OrderRow = {
  id: number;
  createdAt: string; // ISO string
  status: string | null;
  productName: string;
  fullName: string;
  phone: string;
  city: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export default function OrdersTable({
  orders,
  statuses = [],
}: {
  orders: OrderRow[];
  statuses?: string[];
}) {
  const router = useRouter();
  const sp = useSearchParams();

  // filtros por querystring (persisten al recargar)
  const qFrom = sp.get("from") || "";
  const qTo = sp.get("to") || "";
  const qStatus = sp.get("status") || "all";
  const qSearch = sp.get("q") || "";

  const [from, setFrom] = useState(qFrom);
  const [to, setTo] = useState(qTo);
  const [status, setStatus] = useState(qStatus);
  const [search, setSearch] = useState(qSearch);

  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const fromDate = from ? new Date(from + "T00:00:00") : null;
    const toDate = to ? new Date(to + "T23:59:59") : null;

    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;

      if (status !== "all" && (o.status || "").toLowerCase() !== status.toLowerCase())
        return false;

      if (search.trim()) {
        const s = search.trim().toLowerCase();
        const hay =
          (o.productName || "").toLowerCase().includes(s) ||
          (o.fullName || "").toLowerCase().includes(s) ||
          (o.phone || "").toLowerCase().includes(s) ||
          (o.city || "").toLowerCase().includes(s) ||
          String(o.id).includes(s);
        if (!hay) return false;
      }

      return true;
    });
  }, [orders, from, to, status, search]);

  const totalSum = useMemo(() => {
    return filtered.reduce((acc, o) => acc + Number(o.total || 0), 0);
  }, [filtered]);

  function setQuery(next: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === "" || v === "all") params.delete(k);
      else params.set(k, v);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function applyFilters() {
    setQuery({ from, to, status, q: search });
  }

  function clearFilters() {
    setFrom("");
    setTo("");
    setStatus("all");
    setSearch("");
    router.push("?", { scroll: false });
  }

  async function onDelete(id: number) {
    const ok = confirm("¿Eliminar esta orden? Esto devolverá stock y borrará el registro.");
    if (!ok) return;

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteOrder(id);
      setDeletingId(null);

      if (!res?.ok) {
        alert(res?.message || "No se pudo eliminar la orden.");
        return;
      }

      // refresca server component
      router.refresh();
    });
  }

  return (
    <section className="space-y-5">
      {/* Header / Summary */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80"
        >
          <div className="absolute -top-20 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-[70px]" />
          <div className="absolute -bottom-20 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[70px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.80)_78%)]" />
        </div>

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-white/90">
                <Filter size={16} className="text-indigo-300" />
                <h2 className="font-black tracking-wide">Filtros</h2>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Filtra por rango de fechas, estado y búsqueda rápida. (Se guarda en la URL)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[11px] uppercase tracking-widest text-white/40 font-black">
                  Total (filtrado)
                </p>
                <p className="text-white font-black text-lg tabular-nums">
                  ${Math.round(totalSum).toLocaleString("es-CO")}
                </p>
              </div>

              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white/70 hover:bg-white/10 transition"
              >
                <X size={14} /> Limpiar
              </button>
            </div>
          </div>

          {/* Filters row */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <Field label="Desde" icon={<CalendarDays size={16} className="text-indigo-300" />}>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Hasta" icon={<CalendarDays size={16} className="text-indigo-300" />}>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={inputCls}
              />
            </Field>

            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Estado" icon={<Package size={16} className="text-indigo-300" />}>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputCls}
                >
                  <option value="all">Todos</option>
                  {(statuses?.length ? statuses : inferStatuses(orders)).map((s) => (
                    <option key={s} value={s}>
                      {prettyStatus(s)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <Field label="Buscar" icon={<Search size={16} className="text-indigo-300" />}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Producto, cliente, ciudad, teléfono, ID…"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="sm:col-span-2 lg:col-span-2 flex items-end">
              <button
                onClick={applyFilters}
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition disabled:opacity-60"
              >
                <Filter size={14} />
                Aplicar
              </button>
            </div>
          </div>

          <div className="mt-4 sm:hidden">
            <p className="text-[11px] uppercase tracking-widest text-white/40 font-black">
              Total (filtrado)
            </p>
            <p className="text-white font-black text-xl tabular-nums">
              ${Math.round(totalSum).toLocaleString("es-CO")}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/70">
                <tr className="border-b border-white/10 bg-black/25">
                  <Th>Fecha</Th>
                  <Th>Producto</Th>
                  <Th>Cliente</Th>
                  <Th>Ciudad</Th>
                  <Th className="text-center">Cant.</Th>
                  <Th className="text-right">Total</Th>
                  <Th className="text-center">Estado</Th>
                  <Th className="text-right">ID</Th>
                  <Th className="text-right">Acciones</Th>
                </tr>
              </thead>

              <tbody className="text-white/90">
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-white/5 hover:bg-white/[0.04] transition"
                  >
                    <Td className="whitespace-nowrap text-white/80">
                      {formatDate(o.createdAt)}
                    </Td>

                    <Td className="font-black">
                      <span className="line-clamp-1">{o.productName}</span>
                    </Td>

                    <Td>
                      <div className="font-semibold">{o.fullName}</div>
                      <div className="text-white/50 text-xs">{o.phone}</div>
                    </Td>

                    <Td className="text-white/80">{o.city}</Td>

                    <Td className="text-center font-black tabular-nums">
                      {o.quantity}
                    </Td>

                    <Td className="text-right font-black tabular-nums">
                      ${Math.round(o.total).toLocaleString("es-CO")}
                    </Td>

                    <Td className="text-center">
                      <StatusBadge status={o.status} />
                    </Td>

                    <Td className="text-right text-white/60 font-mono">
                      #{o.id}
                    </Td>

                    <Td className="text-right">
                      <button
                        onClick={() => onDelete(o.id)}
                        disabled={isPending || deletingId === o.id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-black text-white/70 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-200 transition disabled:opacity-60"
                        title="Eliminar orden"
                      >
                        <Trash2 size={14} />
                        {deletingId === o.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </Td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-white/50">
                      No hay pedidos con esos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((o) => (
          <div
            key={o.id}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-4 shadow-[0_16px_60px_rgba(0,0,0,0.55)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-80"
            >
              <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-indigo-500/15 blur-[50px]" />
              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-[50px]" />
            </div>

            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-white/60">{formatDate(o.createdAt)}</p>
                <p className="mt-1 font-black text-white line-clamp-1">
                  {o.productName}
                </p>
              </div>
              <StatusBadge status={o.status} />
            </div>

            <div className="relative mt-3 grid grid-cols-2 gap-3">
              <MiniItem icon={<User size={14} className="text-indigo-300" />} label="Cliente" value={o.fullName} />
              <MiniItem icon={<MapPin size={14} className="text-indigo-300" />} label="Ciudad" value={o.city} />
              <MiniItem icon={<Package size={14} className="text-indigo-300" />} label="Cant." value={String(o.quantity)} />
              <MiniItem icon={<Hash size={14} className="text-indigo-300" />} label="ID" value={`#${o.id}`} />
            </div>

            <div className="relative mt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">
                  Total
                </p>
                <p className="text-white font-black text-lg tabular-nums">
                  ${Math.round(o.total).toLocaleString("es-CO")}
                </p>
                <p className="text-xs text-white/50">{o.phone}</p>
              </div>

              <button
                onClick={() => onDelete(o.id)}
                disabled={isPending || deletingId === o.id}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs font-black text-white/70 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-200 transition disabled:opacity-60"
              >
                <Trash2 size={16} />
                {deletingId === o.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 text-center text-white/50">
            No hay pedidos con esos filtros.
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- UI helpers ---------------- */

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/90 outline-none placeholder:text-white/30 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 transition";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="sm:col-span-1 lg:col-span-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/45">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function Th({ children, className = "" }: any) {
  return (
    <th className={`p-4 text-left text-xs font-black uppercase tracking-widest ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: any) {
  return <td className={`p-4 align-middle ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: string | null }) {
  const s = (status || "pendiente").toLowerCase();

  const cls =
    s === "cancelado"
      ? "bg-red-500/12 border-red-500/25 text-red-200"
      : s === "entregado" || s === "completado"
      ? "bg-emerald-500/12 border-emerald-500/25 text-emerald-200"
      : s === "en_proceso" || s === "proceso"
      ? "bg-amber-500/12 border-amber-500/25 text-amber-200"
      : "bg-indigo-500/12 border-indigo-500/25 text-indigo-200";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-black tracking-widest uppercase ${cls}`}
    >
      {prettyStatus(s)}
    </span>
  );
}

function prettyStatus(s: string) {
  const v = s.replaceAll("_", " ").trim();
  return v.length ? v : "Pendiente";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

function inferStatuses(orders: OrderRow[]) {
  const set = new Set<string>();
  orders.forEach((o) => {
    if (o.status) set.add(o.status);
  });
  return Array.from(set);
}

function MiniItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3 min-w-0">
      <div className="flex items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/45">
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm font-bold text-white/90 line-clamp-1">{value}</p>
    </div>
  );
}
