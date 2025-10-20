/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para permitir conexiones al API Gateway
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://localhost:3001/api/v1/business/query',
      },
    ];
  },
  // Configuración adicional para desarrollo
  experimental: {
    serverComponentsExternalPackages: ['@apollo/client'],
  },
};

export default nextConfig;
