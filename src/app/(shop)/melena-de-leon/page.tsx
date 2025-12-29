import { prisma } from "@/lib/prisma";
import MelenaLanding from "@/components/landing/MelenaLanding";

export default async function MelenaDeLeonPage() {
  // Buscamos el producto sin depender de slug (por ahora)
 const product =
  (await prisma.product.findFirst({
    where: {
      isActive: true,
      OR: [
        { name: { equals: "Melena de leon" } },
        { name: { equals: "Melena de León" } },
        { name: { contains: "Melena" } }, // sin mode
        { name: { contains: "melena" } }, // opcional por si collation no es CI
      ],
    },
    select: {
      id: true,
      name: true,
      subtitle: true,
      description: true,
      price: true,
      imageUrl: true,
      benefits: true,
      stock: true,
    },
  })) ?? null;


  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-xl font-semibold">Producto no disponible</h1>
          <p className="mt-2 text-white/70 text-sm">
            No encontramos “Melena de León” activo en la base de datos.
          </p>
        </div>
      </div>
    );
  }

  return <MelenaLanding product={product} />;
}
