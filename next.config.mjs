import withPWA from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
};

export default withPWA({
  dest: "public",
  // PWA service worker presreće cross-origin API pozive i lomi registraciju
  disable: true,
  register: false,
  fallbacks: { document: "/offline" },
})(nextConfig);
