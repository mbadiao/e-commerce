/** @type {import('next').NextConfig} */
const backendProxyTarget = process.env.BACKEND_PROXY_TARGET?.replace(/\/$/, "");

const nextConfig = {
    images: {
      formats: ["image/avif", "image/webp"],
      remotePatterns: [
        // {
        //   protocol: "http",
        //   hostname: "localhost",
        //   pathname: "/images/**",
        // },
        {
          protocol: "https",
          hostname: "cloud.appwrite.io",
          pathname: "/v1/storage/buckets/**",
        },
      ],
    },
    async rewrites() {
      if (!backendProxyTarget) {
        return [];
      }

      return [
        {
          source: "/backend/:path*",
          destination: `${backendProxyTarget}/api/:path*`,
        },
      ];
    },
  };
  
  export default nextConfig;
  
