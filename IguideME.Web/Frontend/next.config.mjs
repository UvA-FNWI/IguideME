/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    poweredByHeader: false,
    reactStrictMode: true,
};

export default nextConfig;
