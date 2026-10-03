module.exports = {
  apps: [
    {
      name: "jianliwangzhan",
      script: "./server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      // 重启防抖：崩溃后等 2 秒再拉起，避免配置错误时疯狂重启刷爆日志；
      // 10 次内仍未稳定运行 20 秒就放弃，防止无限重启循环打满 CPU。
      restart_delay: 2000,
      max_restarts: 10,
      min_uptime: 20 * 1000,
      max_memory_restart: "512M",
      env: {
        // 必须显式声明：Next.js 按 NODE_ENV 决定加载 .env 还是 .env.production，
        // 缺省会读到空配置，表现为登录失败 + 数据库 503。
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
        PORT: 3000,
      },
    },
  ],
};
