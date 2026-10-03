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

## 服务器启动

假设你已将压缩包解压到 `/www/wwwroot/jianliwangzhan`：

### 方式一：直接启动

```bash
cd /www/wwwroot/jianliwangzhan
HOSTNAME=0.0.0.0 PORT=3000 NODE_ENV=production node server.js
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

- 上传前检查 `.env.production`
- standalone 包内会带上 `.env.production`
- 如果服务器环境变量有调整，直接修改解压目录下的 `.env.production` 后重启服务即可
