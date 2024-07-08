/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
  };
  
  export default nextConfig;
  