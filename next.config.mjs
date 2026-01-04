/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Build konfigürasyonu
  typescript: {
    // Type checking sırasında build'i bloklamayı devre dışı bırak
    ignoreBuildErrors: false,
  },

  turbopack: {},
}

export default nextConfig
