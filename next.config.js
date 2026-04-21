const nextConfig = {
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 2678400,
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.rescuegroups.org',
      },
      {
        protocol: 'https',
        hostname: 'api-ninjas.com',
      },
    ],
  },
};

module.exports = nextConfig;
