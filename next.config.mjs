import withPWA from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: process.env.NODE_ENV === "production",
  fallbacks: { document: "/offline" },
})(nextConfig);
