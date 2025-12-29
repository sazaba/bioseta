"use client";

import Link from "next/link";
import { LuExternalLink, LuCopy } from "react-icons/lu";

type LandingItem = {
  id: number;
  name: string;
  url: string; // path relativo: /melena-de-leon
};

export default function LandingsList({ items }: { items: LandingItem[] }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback simple: no hacemos nada, pero no crashea
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/60">
        No hay landings activas.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((p) => {
        const full = `${baseUrl}${p.url}`;

        return (
          <div
            key={p.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white">{p.name}</div>
              <div className="mt-1 text-xs text-white/60 break-all">{full}</div>
            </div>

            <div className="flex gap-2">
              <Link
                href={p.url}
                target="_blank"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                <LuExternalLink size={14} />
                Abrir
              </Link>

              <button
                type="button"
                onClick={() => copy(full)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                <LuCopy size={14} />
                Copiar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
