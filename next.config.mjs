/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
                pathname: "/images/**",
            },
            {
                protocol: "https",
                hostname: "myapi.com",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default nextConfig;
