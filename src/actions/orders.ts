"use server";

import { prisma } from "@/lib/prisma"; // ajusta si tu prisma client está en otra ruta
import { headers, cookies } from "next/headers";
import { sendOwnerOrderEmail } from "@/lib/mailer";
import { revalidatePath } from "next/cache";


type CreateOrderInput = {
  productId: number;
  quantity?: number;

  fullName: string;
  phone: string;
  email?: string;
  documentId?: string;

  city: string;
  address: string;
  neighborhood?: string;
  notes?: string;

  fbclid?: string;
  fbp?: string;
  fbc?: string;
};

export async function createOrder(input: CreateOrderInput) {
  // Validación mínima (cero fricción)
  if (!input.productId) return { ok: false, message: "Producto inválido." };
  if (!input.fullName?.trim()) return { ok: false, message: "Nombre requerido." };
  if (!input.phone?.trim()) return { ok: false, message: "Celular requerido." };
  if (!input.city?.trim()) return { ok: false, message: "Ciudad requerida." };
  if (!input.address?.trim()) return { ok: false, message: "Dirección requerida." };

  const qty = Math.max(1, Number(input.quantity || 1));

  // Traemos precio real desde DB (evita manipulación)
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    select: { id: true, name: true, price: true, isActive: true, stock: true },
  });


  if (!product || product.isActive === false) {
    return { ok: false, message: "Producto no disponible." };
  }

  if (product.stock < qty) {
    return { ok: false, message: "Stock insuficiente." };
  }

  // Price es Decimal en Prisma → lo tratamos como string/number seguro a 2 decimales
  const unitPrice = product.price; // Decimal
  const total = (Number(product.price) * qty).toFixed(2);

  const h = await headers();
  const ua = h.get("user-agent") || undefined;

  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    undefined;

  // (Opcional) Capturar cookies meta si existen
  const c = await cookies();
  const cookieFbp = c.get("_fbp")?.value;
  const cookieFbc = c.get("_fbc")?.value;

  const order = await prisma.order.create({
    data: {
      productId: product.id,
      quantity: qty,
      unitPrice, // Decimal
      total, // Prisma lo convertirá a Decimal por el @db.Decimal

      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      documentId: input.documentId?.trim() || null,

      country: "CO",
      city: input.city.trim(),
      address: input.address.trim(),
      neighborhood: input.neighborhood?.trim() || null,
      notes: input.notes?.trim() || null,

      fbclid: input.fbclid || null,
      fbp: input.fbp || cookieFbp || null,
      fbc: input.fbc || cookieFbc || null,
      userAgent: ua || null,
      ipAddress: ip || null,
    },
    select: { id: true, createdAt: true },
  });

  // (Opcional) Reducir stock automáticamente (si quieres)
  // Reducir stock
  await prisma.product.update({
    where: { id: product.id },
    data: { stock: { decrement: qty } },
  });

  // Enviar email al dueño (NO debe romper la compra si falla)
  try {
       await sendOwnerOrderEmail({
      orderId: order.id,
      productName: product.name,
      qty,
      unitPrice: Number(product.price),
      total: Number(product.price) * qty,
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      city: input.city.trim(),
      address: input.address.trim(),
    });

  } catch (e) {
    console.error("[mailer] Failed to send owner email:", e);
  }

  return { ok: true, orderId: order.id };

}


export async function deleteOrder(orderId: number) {
  try {
    if (!orderId || Number.isNaN(Number(orderId))) {
      return { ok: false, message: "ID inválido" };
    }

    const id = Number(orderId);

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        select: { id: true, quantity: true, productId: true },
      });

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      // devolver stock
      await tx.product.update({
        where: { id: order.productId },
        data: { stock: { increment: order.quantity } },
      });

      // borrar orden
      await tx.order.delete({ where: { id } });
    });

    // ✅ Revalidar rutas donde ves órdenes (por si tienes 2 páginas)
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard/orders");

    return { ok: true };
  } catch (e: any) {
    if (e?.message === "ORDER_NOT_FOUND") {
      return { ok: false, message: "Orden no encontrada" };
    }
    console.error("[deleteOrder] error:", e);
    return { ok: false, message: "No se pudo eliminar la orden" };
  }
}
