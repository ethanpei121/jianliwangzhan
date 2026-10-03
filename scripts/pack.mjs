import { access, constants, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, ".next", "standalone");
const publicSourceDir = path.join(rootDir, "public");
const publicTargetDir = path.join(standaloneDir, "public");
const staticSourceDir = path.join(rootDir, ".next", "static");
const staticTargetDir = path.join(standaloneDir, ".next", "static");
const pm2ConfigSourcePath = path.join(rootDir, "ecosystem.config.cjs");
const pm2ConfigTargetPath = path.join(standaloneDir, "ecosystem.config.cjs");
const envSourcePath = path.join(rootDir, ".env.production");
const envTargetPath = path.join(standaloneDir, ".env.production");
const packageJsonSourcePath = path.join(rootDir, "package.json");
const packageJsonTargetPath = path.join(standaloneDir, "package.json");

async function pathExists(targetPath) {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(sourceDir, targetDir) {
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(path.dirname(targetDir), { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true, force: true });
}

async function copyFileIfExists(sourcePath, targetPath) {
  const exists = await pathExists(sourcePath);
  if (!exists) {
    return;
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, { force: true });
}

async function copyFile(sourcePath, targetPath) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, { force: true });
}

async function writeRuntimePackageJson() {
  const rawPackageJson = await readFile(packageJsonSourcePath, "utf8");
  const sourcePackageJson = JSON.parse(rawPackageJson);
  const runtimePackageJson = {
    name: sourcePackageJson.name,
    version: sourcePackageJson.version,
    private: sourcePackageJson.private,
    scripts: {
      start: "node server.js",
    },
    engines: {
      node: ">=18.17.0",
    },
  };

  await writeFile(
    packageJsonTargetPath,
    `${JSON.stringify(runtimePackageJson, null, 2)}\n`,
    "utf8"
  );
}

async function main() {
  const standaloneExists = await pathExists(standaloneDir);
  if (!standaloneExists) {
    throw new Error("未找到 .next/standalone，请先执行 `next build` 并确认已启用 standalone 输出。");
  }

  const staticExists = await pathExists(staticSourceDir);
  if (!staticExists) {
    throw new Error("未找到 .next/static，请先执行 `next build` 生成生产构建产物。");
  }

  // .env.production 被 .gitignore 忽略，新克隆的仓库必然没有它。
  // 以前这里是静默跳过，会打出一个缺数据库配置的包，上传到服务器才暴雷成 503。
  // 与 static 的处理方式对齐：缺了就直接抛错。
  const envExists = await pathExists(envSourcePath);
  if (!envExists) {
    throw new Error(
      "未找到 .env.production。请先复制 .env.example 为 .env.production 并填入生产环境真实值（Clerk 密钥、MySQL 连接信息）。"
    );
  }

  const publicExists = await pathExists(publicSourceDir);
  if (publicExists) {
    await copyDirectory(publicSourceDir, publicTargetDir);
  } else {
    await rm(publicTargetDir, { recursive: true, force: true });
    await mkdir(publicTargetDir, { recursive: true });
  }

  await copyDirectory(staticSourceDir, staticTargetDir);
  await copyFileIfExists(pm2ConfigSourcePath, pm2ConfigTargetPath);
  await copyFile(envSourcePath, envTargetPath);
  await writeRuntimePackageJson();

  console.log(
    "\x1b[32m%s\x1b[0m",
    "✅ Standalone 独立包已整理完毕，请直接压缩 .next/standalone 文件夹上传至服务器！"
  );
}

main().catch((error) => {
  console.error("\x1b[31m%s\x1b[0m", `打包整理失败：${error.message}`);
  process.exit(1);
});
