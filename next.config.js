/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = withPWA({
  output: "export",
});

module.exports = nextConfig;
