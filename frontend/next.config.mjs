/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVER_URL: process.env.SERVER_URL,
    APP_DOMAIN_NAME: process.env.APP_DOMAIN_NAME,
  },
};

export default nextConfig;
