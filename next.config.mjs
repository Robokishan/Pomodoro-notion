import { env } from "./src/env/server.mjs";
import WithPWA from "next-pwa";

const withPWA = WithPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});
/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default withPWA(
  defineNextConfig({
    // reactStrictMode: true,
    swcMinify: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
        {
          protocol: "https",
          hostname: "picsum.photos",
        },
        {
          protocol: "https",
          hostname: "upload.wikimedia.org",
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
            // for webpack 5 use
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
  })
);
