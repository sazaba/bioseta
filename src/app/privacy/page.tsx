import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-stone-300 py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500 mb-8 block hover:opacity-70 transition-opacity">← Volver al inicio</Link>
        
        <h1 className="text-4xl md:text-6xl font-sans font-black text-white uppercase tracking-tighter mb-12 leading-none">
          Política de <br />Privacidad
        </h1>

        <div className="prose prose-invert prose-stone prose-lg font-serif">
          <p className="lead text-xl text-white">Tu soberanía incluye tus datos.</p>
          
          <h3>1. Recolección de Información</h3>
          <p>Recopilamos información cuando te registras en nuestro sitio, realizas un pedido o te suscribes a nuestro boletín. La información recopilada incluye tu nombre, dirección de correo electrónico, número de teléfono y dirección de envío.</p>
          
          <h3>2. Uso de la Información</h3>
          <p>Cualquier información que recopilamos de ti puede ser utilizada para:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Personalizar tu experiencia y responder a tus necesidades individuales.</li>
            <li>Mejorar nuestro sitio web.</li>
            <li>Mejorar el servicio al cliente.</li>
            <li>Procesar transacciones de manera segura.</li>
          </ul>
          
          <h3>3. Protección de Datos</h3>
          <p>Implementamos una variedad de medidas de seguridad para mantener la seguridad de tu información personal. No vendemos, intercambiamos ni transferimos a terceros tu información personal identificable.</p>
        </div>
      </div>
    </main>
  );
}