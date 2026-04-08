/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Nécessaire pour GitHub Pages (le repo s'appelle PlateformeAppel)
  basePath: '/PlateformeAppel',
  assetPrefix: '/PlateformeAppel',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
