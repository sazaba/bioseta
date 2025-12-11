"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Crear Producto
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const subtitle = formData.get("subtitle") as string;
  const stock = parseInt(formData.get("stock") as string);
  const benefitsString = formData.get("benefits") as string; // Recibimos "Focus, Memoria"
  
  // Convertimos el string de beneficios a array JSON
  const benefits = benefitsString.split(",").map(b => b.trim()).filter(b => b !== "");

  const imageUrl = formData.get("imageUrl") as string;

  await prisma.product.create({
    data: {
      name,
      price,
      category,
      description,
      subtitle,
      stock,
      imageUrl: imageUrl,
      benefits: benefits,
      isActive: true,
    },
  });

  revalidatePath("/admin/dashboard"); // Refresca la pantalla automáticamente
}

// 2. Eliminar Producto
export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/dashboard");
}

// 3. Toggle Estado (Activo/Inactivo)
export async function toggleProductStatus(id: number, currentStatus: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
  revalidatePath("/admin/dashboard");
}


// 4. Actualizar Producto
export async function updateProduct(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const subtitle = formData.get("subtitle") as string;
  const stock = parseInt(formData.get("stock") as string);
  const imageUrl = formData.get("imageUrl") as string;
  
  const benefitsString = formData.get("benefits") as string;
  const benefits = benefitsString.split(",").map(b => b.trim()).filter(b => b !== "");

  await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      category,
      description,
      subtitle,
      stock,
      imageUrl,
      benefits,
    },
  });

  revalidatePath("/admin/dashboard");
}