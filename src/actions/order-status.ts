"use server";

import { prisma } from "@/lib/prisma";

export async function updateOrderStatus(orderId: number, status: string) {
  if (!orderId) return { ok: false, message: "Pedido inválido." };

  const allowed = ["nuevo", "en_proceso", "enviado", "entregado", "cancelado"];
  if (!allowed.includes(status)) {
    return { ok: false, message: "Estado inválido." };
  }

  const updated = await prisma.order.update({
    where: { id: Number(orderId) },
    data: { status: status as any },
    select: { id: true, status: true },
  });

  return { ok: true, orderId: updated.id, status: updated.status };
}
