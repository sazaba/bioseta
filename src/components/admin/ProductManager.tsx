"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct, deleteProduct, toggleProductStatus } from "@/actions/products";
import { CldUploadWidget } from "next-cloudinary";

interface Product {
  id: number;
  name: string;
  price: any;
  category: string;
  stock: number;
  isActive: boolean;
  imageUrl: string;
}

export const ProductManager = ({ products }: { products: Product[] }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl text-white font-serif tracking-wide">INVENTARIO</h2>
          <p className="text-stone-500 text-xs font-mono mt-1">GESTIÓN DE ACTIVOS BIOLÓGICOS</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-sm font-bold text-xs tracking-[0.2em] uppercase transition-colors flex items-center gap-2"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-white/5 p-4 text-[10px] font-mono text-stone-400 uppercase tracking-widest border-b border-white/10">
          <div className="col-span-1 text-center">ID</div>
          <div className="col-span-1">Img</div>
          <div className="col-span-3">Producto</div>
          <div className="col-span-2">Categoría</div>
          <div className="col-span-2 text-right">Precio</div>
          <div className="col-span-1 text-center">Stock</div>
          <div className="col-span-2 text-center">Acciones</div>
        </div>

        <div className="divide-y divide-white/5">
          {products.length === 0 ? (
            <div className="p-12 text-center text-stone-600 font-serif italic">
              No hay productos en el catálogo aún.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="grid grid-cols-12 items-center p-4 text-sm hover:bg-white/[0.02] transition-colors group">
                <div className="col-span-1 text-center text-stone-600 font-mono">#{product.id}</div>
                
                {/* Miniatura Imagen */}
                <div className="col-span-1 flex justify-center">
                   <div className="w-10 h-10 rounded bg-white/5 overflow-hidden border border-white/10">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                   </div>
                </div>

                <div className="col-span-3 font-sans font-bold text-white flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {product.name}
                </div>
                
                <div className="col-span-2">
                  <span className="px-2 py-1 border border-white/10 rounded text-[10px] text-stone-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
                
                <div className="col-span-2 text-right text-amber-500 font-mono">
                  ${Number(product.price).toLocaleString()}
                </div>
                
                <div className="col-span-1 text-center text-stone-400 font-mono">
                  {product.stock}
                </div>
                
                <div className="col-span-2 flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleProductStatus(product.id, product.isActive)} className="text-xs hover:text-white transition-colors">
                    {product.isActive ? "🛑" : "✅"}
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="text-xs hover:text-red-500 transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FORMULARIO MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#0F1115] border-l border-white/10 z-50 p-8 overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif text-white">NUEVO PRODUCTO</h3>
                <button onClick={() => setIsFormOpen(false)} className="text-stone-500 hover:text-white">✕</button>
              </div>

              <form action={async (formData) => {
                  await createProduct(formData);
                  setIsFormOpen(false);
                  setImageUrl(""); // Resetear al guardar
              }} className="flex flex-col gap-6">
                
                {/* UPLOADER DE IMAGEN */}
                <div className="space-y-2">
                   <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Fotografía del Producto</label>
                   
                   <input type="hidden" name="imageUrl" value={imageUrl} required />

                   <CldUploadWidget 
                      uploadPreset="bioseta_preset" // <--- TU PRESET REAL
                      onSuccess={(result: any) => {
                         setImageUrl(result.info.secure_url);
                      }}
                   >
                      {({ open }) => {
                        return (
                          <div 
                            onClick={() => open()}
                            className="w-full h-40 border border-dashed border-white/20 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group relative overflow-hidden"
                          >
                             {imageUrl ? (
                               <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                               <div className="text-center">
                                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📸</span>
                                  <span className="text-xs text-stone-400 uppercase tracking-widest group-hover:text-amber-500">Subir Imagen</span>
                               </div>
                             )}
                          </div>
                        );
                      }}
                   </CldUploadWidget>
                </div>

                {/* INPUTS DE TEXTO */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Nombre</label>
                  <input name="name" required className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Subtítulo</label>
                  <input name="subtitle" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Categoría</label>
                    <select name="category" className="w-full bg-black/50 border border-white/10 p-3 text-stone-300 focus:border-amber-500 outline-none rounded-sm">
                      <option value="mente">Mente</option>
                      <option value="calma">Calma</option>
                      <option value="energia">Energía</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Precio</label>
                    <input name="price" type="number" required className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Stock</label>
                    <input name="stock" type="number" defaultValue="100" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Beneficios</label>
                    <input name="benefits" placeholder="Focus, Memoria" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-stone-500 tracking-widest">Descripción</label>
                  <textarea name="description" rows={4} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-amber-500 outline-none rounded-sm"></textarea>
                </div>

                <button type="submit" disabled={!imageUrl} className="mt-4 bg-white text-black font-bold uppercase tracking-[0.2em] py-4 hover:bg-amber-400 transition-colors rounded-sm disabled:opacity-50">
                  Guardar Producto
                </button>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};