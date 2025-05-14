
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Redirects for compatibility with old React routes
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/vent/:path*',
        destination: '/vent/[id]',
        permanent: true,
      },
    ];
  },
  // Configure webpack to handle polyfills for browser APIs
  webpack: (config) => {
    // Add buffer polyfill for compatibility
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
    };
    
    return config;
  },
};

module.exports = nextConfig;
