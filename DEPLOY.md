# 国内服务器部署说明

本文档对应 Next.js standalone 部署方式，目标是避免在服务器执行 `npm install`。

## 本地打包

在项目根目录执行：

```bash
npm run deploy:pack
```

打包完成后，直接压缩整个 `.next/standalone` 文件夹上传到服务器。

## 服务器要求

- Node.js 18.17+，建议 Node.js 20 LTS
- Linux 服务器可正常运行 `node`
- 如需守护进程，建议安装 `pm2`

## 初始化数据库

standalone 包里不包含建表脚本，**请在本地执行一次 `npm run init:db`**，
或把 `db/schema.sql` 拷到服务器上手工执行：

```bash
mysql -u root -p < db/schema.sql
```

不建表的话，应用能正常启动，但打开 `/builder` 保存简历时会返回
`503 {"code":"NOT_CONFIGURED"}`（若连不上库则是 500）。

## 服务器启动

假设你已将压缩包解压到 `/www/wwwroot/jianliwangzhan`：

> ⚠️ **先执行 `export NODE_ENV=production`**。
> Next.js 按 `NODE_ENV` 决定加载 `.env` 还是 `.env.production`，
> 不设置的话会读到空配置，表现为登录失败 + 数据库 503。

### 方式一：直接启动

```bash
cd /www/wwwroot/jianliwangzhan
export NODE_ENV=production
HOSTNAME=0.0.0.0 PORT=3000 node server.js
```

也可以直接执行：

```bash
cd /www/wwwroot/jianliwangzhan
npm start
```

注意：这里不要执行 `npm run dev`，standalone 包是生产运行包，不包含 `next dev` 所需的 CLI。

### 方式二：使用 PM2 启动

如果服务器还没有 `pm2`：

```bash
npm i -g pm2
```

启动命令：

```bash
cd /www/wwwroot/jianliwangzhan
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 反向代理示例

如果你使用 Nginx，可将域名反代到 `3000` 端口：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 环境变量

- 上传前检查 `.env.production`。打包脚本已改为**缺失即报错**（`.env.production` 被
  `.gitignore` 忽略，新克隆的仓库不会有它），不会再打出缺配置的包
- standalone 包内会带上 `.env.production`
- **哪些能改、哪些不能改**：

| 变量 | 运行期改 `.env.production` 是否生效 |
|------|-----------------------------------|
| `DB_*`、`CLERK_SECRET_KEY`、`ALIYUN_API_KEY` | ✅ 生效，改完重启服务即可 |
| 所有 `NEXT_PUBLIC_*` | ❌ **不生效**。它们在 `next build` 阶段被静态内联进客户端 bundle，必须本地改完重新执行 `npm run deploy:pack` 再上传 |

### 运行期变量

以下通常由启动命令或 PM2 提供，无需写进 `.env.production`：

- `NODE_ENV=production` —— **必须**，决定加载哪个 env 文件
- `HOSTNAME=0.0.0.0` —— 必须绑 `0.0.0.0` 才能被 Nginx 反代访问
- `PORT=3000`
