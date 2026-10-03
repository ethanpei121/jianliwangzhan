import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { RowDataPacket } from "mysql2/promise";

import { getDb, isDatabaseConfigured } from "@/lib/db";

/** 简历读写依赖登录态，禁止任何形式的缓存。 */
export const dynamic = "force-dynamic";

type ResumeRow = RowDataPacket & {
  data: unknown;
  updated_at: Date;
};

function notConfigured() {
  return NextResponse.json(
    {
      error: "数据库未配置：请在 .env.local 中设置 DB_USER / DB_PASSWORD / DB_NAME，并执行 node scripts/init-db.mjs",
      code: "NOT_CONFIGURED",
    },
    { status: 503 },
  );
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return notConfigured();
  }

  const db = getDb();
  if (!db) {
    return notConfigured();
  }

  try {
    const [rows] = await db.query<ResumeRow[]>(
      "SELECT data, updated_at FROM resumes WHERE user_id = ? LIMIT 1",
      [userId],
    );
    return NextResponse.json({
      data: rows[0]?.data ?? null,
      updatedAt: rows[0]?.updated_at ?? null,
    });
  } catch (error) {
    console.error("[resumes] 读取失败:", error);
    return NextResponse.json({ error: "读取简历失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  if (!isDatabaseConfigured) {
    return notConfigured();
  }

  const db = getDb();
  if (!db) {
    return notConfigured();
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  // 自动保存的是草稿，允许内容不完整；但必须是 JSON 对象，避免写入垃圾数据。
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return NextResponse.json({ error: "简历数据格式不正确" }, { status: 400 });
  }

  try {
    await db.query(
      `INSERT INTO resumes (user_id, data)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = CURRENT_TIMESTAMP`,
      [userId, JSON.stringify(payload)],
    );
    return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) {
    console.error("[resumes] 保存失败:", error);
    return NextResponse.json({ error: "保存简历失败" }, { status: 500 });
  }
}
