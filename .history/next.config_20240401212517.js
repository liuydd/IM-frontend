/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            // Change to your backend URL in production
            destination: "https://backend-fishandchips.app.secoder.net/:path*",
        }];
    }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
