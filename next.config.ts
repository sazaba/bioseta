/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },

      // ✅ AGREGAR (si usas Cloudinary)
      { protocol: "https", hostname: "res.cloudinary.com" },

      // ✅ Si tus imágenes vienen de tu propio dominio, agrégalo aquí también:
      // { protocol: "https", hostname: "tudominio.com" },
    ],
  },
};

export default nextConfig;
