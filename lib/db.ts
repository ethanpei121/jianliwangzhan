import mysql, { type Pool } from "mysql2/promise";

/**
 * 服务端 MySQL 连接池。
 *
 * ⚠️ 只允许在 Route Handler / Server Action / Node 脚本中导入。
 * 浏览器永远不直连数据库 —— 用户隔离完全依靠 /api/resumes 里的 Clerk userId。
 */

const host = process.env.DB_HOST || "127.0.0.1";
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD ?? "";
const database = process.env.DB_NAME;

/** 供 UI 判断"是否已接入数据库"，避免未配置时直接崩页面。 */
export const isDatabaseConfigured = Boolean(user && database);

let pool: Pool | null = null;

export function getDb(): Pool | null {
  if (typeof window !== "undefined") {
    throw new Error("getDb 只能在服务端调用，禁止在客户端组件中导入");
  }
  if (!user || !database) {
    return null;
  }
  if (!pool) {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      charset: "utf8mb4",
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 5,
      idleTimeout: 60_000,
      queueLimit: 0,
      enableKeepAlive: true,
    });
  }
  return pool;
}
