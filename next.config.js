const nextConfig = {
  images: {
    minimumCacheTTL: 2678400,
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
