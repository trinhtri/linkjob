/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === "production" ? "" : "",
  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "http://linkjob.somee.com/api" // development api
        : "https://localhost:7249/api", // production api
  },
};

module.exports = nextConfig;
