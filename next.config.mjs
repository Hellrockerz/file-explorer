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
                hostname: "'file-explorer-backend-production.up.railway.app'",
                pathname: "/images/**",
            },
        ],
    },
};

export default nextConfig;
