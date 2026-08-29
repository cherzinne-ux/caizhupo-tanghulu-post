# 每日投稿墙

一个 Next.js + Vercel Postgres 的在线每日投稿网站。

## 已实现
- 默认显示当天投稿
- 每条投稿按服务器时间自动获得当天编号
- 每天编号从 #1 重新开始
- 历史日期分类与投稿数量
- 每个 IP 每天最多投稿一次（服务端限制）
- IP 只以按日期+盐哈希后的形式保存
- 手机端适配
- 500 字投稿限制

## 本地运行
1. 安装 Node.js 18+
2. `npm install`
3. 创建 PostgreSQL 数据库并执行 `db.sql`
4. 设置 `.env.local`
5. `npm run dev`

## 部署
推荐部署到 Vercel，并连接 Vercel Postgres/兼容 PostgreSQL 数据库。
将环境变量填入 Vercel 项目设置。
