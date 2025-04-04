/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.imagedomain.com',
          port: '',
          pathname: '/**', // autorise tous les chemins
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  