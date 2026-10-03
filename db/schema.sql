-- 简历数据表（MySQL 版）
-- 本地执行方式（任选其一）：
--   mysql -u root -p < db/schema.sql
--   或在 MySQL Workbench / Navicat / phpMyAdmin 里整段执行
-- 脚本可重复执行，已做 IF NOT EXISTS 保护。

CREATE DATABASE IF NOT EXISTS jianliwangzhan
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jianliwangzhan;

CREATE TABLE IF NOT EXISTS resumes (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id     VARCHAR(191) NOT NULL COMMENT 'Clerk userId，应用层做隔离',
  data        JSON         NOT NULL COMMENT '整份简历的草稿快照',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_resumes_user_id (user_id),
  KEY idx_resumes_updated_at (updated_at)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '一人一份简历，保存即覆盖（INSERT ... ON DUPLICATE KEY UPDATE）';

-- ─── 安全说明 ───
-- MySQL 没有行级安全（RLS）机制。
-- 用户隔离完全由应用层保证：
--   1. 浏览器永远不直连数据库，只能调 /api/resumes
--   2. 该接口用 Clerk 的 auth() 取 userId，所有 SQL 都带 WHERE user_id = ?
--   3. user_id 唯一索引保证一人一条记录，不会串号
-- 因此数据库连接账号请只授予本库的 SELECT / INSERT / UPDATE 权限，不要用 root 跑生产。
--
-- 建议创建专用账号（按需修改密码）：
--   CREATE USER 'jianli'@'%' IDENTIFIED BY '换成强密码';
--   GRANT SELECT, INSERT, UPDATE ON jianliwangzhan.* TO 'jianli'@'%';
--   FLUSH PRIVILEGES;
