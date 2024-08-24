/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Disable source maps in development
  optimizeFonts: false, // Disable font optimization
  swcMinify: true, // Use SWC for minification
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  distDir: 'dist'
};

export default nextConfig;
