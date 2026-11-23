const createNextIntlPlugin = require("next-intl/plugin");
// const runtimeCaching = require("next-pwa/cache")

const withNextIntl = createNextIntlPlugin();

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  scope: "/app",
  register: true,
  sw: "/service-worker.js", // Change this to service-worker.js
  // runtimeCaching,
  buildExcludes: [/app-build-manifest.json$/],
  runtimeCaching: [
    {
      // Cache icons
      urlPattern: /^\/icons\//,
      handler: "CacheFirst",
      options: {
        cacheName: "icons-cache",
        expiration: {
          // maxEntries: 32,
          maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
        }
      }
    },
    {
      // Cache images
      urlPattern: /^\/images\//,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          // maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    },
    {
      // Cache fonts
      urlPattern: /^\/fonts\//,
      handler: "CacheFirst",
      options: {
        cacheName: "fonts-cache",
        expiration: {
          // maxEntries: 16,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    }
  ]
});

const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_CURRENT_VERSION: process.env.NEXT_PUBLIC_CURRENT_VERSION
  },
  swcMinify: true,
  output: "standalone",
  // webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false
    };

    return config;
  }
};

module.exports = withNextIntl(withPWA(nextConfig));
