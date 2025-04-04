/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.imagin.studio', // Remplacez le domaine ici
          port: '',
          pathname: '/**', // Autorise tous les chemins
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  