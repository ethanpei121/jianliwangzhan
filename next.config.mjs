/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    // Next 14.2 内置的外部化白名单共 53 项，含 pg / prisma / better-sqlite3，
    // 但不含 mysql2。不显式声明的话 mysql2 会被 webpack 打进 server bundle，
    // 其内部对 lib/parsers/* 的动态 require 在 standalone 下可能解析失败。
    serverComponentsExternalPackages: ["mysql2"],
  },
};

export default nextConfig;
