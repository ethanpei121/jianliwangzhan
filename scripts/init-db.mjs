/**
 * 初始化本地数据库：读取 .env.local 的连接配置，执行 db/schema.sql。
 *
 * 用法：
 *   node scripts/init-db.mjs
 *
 * 依赖：mysql2（已在 package.json 中）
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import mysql from "mysql2/promise";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

function loadEnv(file) {
  const result = {};
  let raw;
  try {
    raw = readFileSync(resolve(root, file), "utf8");
  } catch {
    return result;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    result[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return result;
}

// 加载优先级：.env < .env.local < .env.production
// 带上 .env.production 是为了在服务器（standalone 包）里也能直接跑建表脚本。
const env = {
  ...loadEnv(".env"),
  ...loadEnv(".env.local"),
  ...loadEnv(".env.production"),
};

const config = {
  host: env.DB_HOST || "127.0.0.1",
  port: Number(env.DB_PORT || 3306),
  user: env.DB_USER || "root",
  password: env.DB_PASSWORD || "",
  multipleStatements: true,
};

if (!config.user) {
  console.error("缺少 DB_USER，请先在 .env.local 配置数据库连接。");
  process.exit(1);
}

const sql = readFileSync(resolve(root, "db", "schema.sql"), "utf8");

const connection = await mysql.createConnection(config);
try {
  await connection.query(sql);
  const [tables] = await connection.query(
    "SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
    [env.DB_NAME || "jianliwangzhan"],
  );
  console.log("建表完成：");
  for (const t of tables) {
    console.log(`  - ${t.TABLE_NAME}（约 ${t.TABLE_ROWS} 行）`);
  }
} finally {
  await connection.end();
}
