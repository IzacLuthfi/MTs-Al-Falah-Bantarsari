import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA saat developing
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Config lain jika ada
};

export default withPWA(nextConfig);