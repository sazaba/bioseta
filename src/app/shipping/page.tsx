import Link from "next/link";

export default function ShippingPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-stone-300 py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500 mb-8 block hover:opacity-70 transition-opacity">← Volver al inicio</Link>
        
        <h1 className="text-4xl md:text-6xl font-sans font-black text-white uppercase tracking-tighter mb-12 leading-none">
          Envíos & <br />Devoluciones
        </h1>

        <div className="prose prose-invert prose-stone prose-lg font-serif">
          <p className="lead text-xl text-white">Logística de precisión.</p>
          
          <h3>1. Tiempos de Envío</h3>
          <p>Procesamos los pedidos dentro de las 24 horas hábiles siguientes a la confirmación del pago.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Medellín y Área Metropolitana:</strong> 1-2 días hábiles.</li>
            <li><strong>Ciudades Principales:</strong> 2-3 días hábiles.</li>
            <li><strong>Resto del país:</strong> 3-5 días hábiles.</li>
          </ul>
          
          <h3>2. Costos de Envío</h3>
          <p>El costo del envío se calcula al momento de finalizar la compra a través de WhatsApp o nuestra pasarela, dependiendo de tu ubicación exacta.</p>
          
          <h3>3. Política de Devoluciones</h3>
          <p>Debido a la naturaleza de nuestros productos (suplementos de consumo), solo aceptamos devoluciones si el producto llega dañado, roto o si recibiste el ítem equivocado. Tienes 5 días hábiles después de recibir el producto para reportar cualquier novedad a nuestro equipo de soporte.</p>
        </div>
      </div>
    </main>
  );
}