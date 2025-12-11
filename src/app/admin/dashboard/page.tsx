import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LuxuryLogo } from "@/components/LuxuryLogo";
import { prisma } from "@/lib/prisma"; // 1. Importamos la conexión a la BD

export default async function Dashboard() {
  // A. Verificamos la sesión (Cookie)
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  // B. Buscamos los datos frescos en la Base de Datos usando el ID de la sesión
  // Convertimos el ID a número porque en la BD es un Int, pero en la cookie es string
  const user = await prisma.user.findUnique({
    where: { 
      id: Number(session.userId) 
    },
  });

  // C. Seguridad extra: Si la cookie es válida pero el usuario fue borrado de la BD
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      {/* Fondo de ruido */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      
      <div className="z-10 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <LuxuryLogo className="w-24 h-24" />
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-serif text-amber-500 tracking-widest">
            BIENVENIDO
          </h1>
          
          {/* AQUÍ ESTÁ EL CAMBIO: Leemos el nombre real */}
          <p className="text-white font-sans font-bold text-xl tracking-[0.2em] uppercase">
            {user.name}
          </p>
          
          {/* Opcional: Mostrar el email para confirmar que es el correcto */}
          <span className="text-stone-600 text-xs font-mono lowercase tracking-widest">
            {user.email}
          </span>
        </div>

        <div className="px-6 py-2 border border-green-500/30 bg-green-500/10 rounded-full">
          <p className="text-green-400 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Sistema Conectado
          </p>
        </div>

        <p className="text-stone-500 text-sm max-w-md font-sans">
          Estás dentro del panel de control de Bioseta. <br/>
          Próximamente aquí podrás gestionar tus productos.
        </p>
      </div>
    </main>
  );
}