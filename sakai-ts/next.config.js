/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === "production" ? "" : "",
  publicRuntimeConfig: {
    apiUrl:process.env.API_URL 
  },
};

module.exports = nextConfig;
