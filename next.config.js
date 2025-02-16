export default {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone", // ✅ Required for Vercel
  experimental: {
    serverActions: true, // ✅ (if using Next.js App Router)
  },
};
