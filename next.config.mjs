import { env } from "./src/env/server.mjs";
import withPWA from "@ducanh2912/next-pwa";

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

const nextConfig = defineNextConfig({
  // reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push(
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: {
          loader: "file-loader",
          options: {
            publicPath: `/_next/static/audio/`,
            outputPath: `${isServer ? "../" : ""}static/audio/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      },
      {
        test: /\.svg$/,
        issuer: {
          and: [/\.(js|ts)x?$/],
        },
        use: ["@svgr/webpack"],
      }
    );
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/notion/:path*",
        destination: "https://api.notion.com/:path*",
      },
    ];
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
