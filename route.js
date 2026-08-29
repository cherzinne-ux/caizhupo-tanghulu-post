import { sql } from "@vercel/postgres";
import crypto from "crypto";

export const runtime = "nodejs";

function todayCN() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
}

function getIP(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export async function POST(req) {
  try {
    const { content } = await req.json();
    if (typeof content !== "string" || !content.trim()) {
      return Response.json({error: "投稿内容不能为空"}, {status: 400});
    }
    if (content.trim().length > 500) {
      return Response.json({error: "投稿最多 500 字"}, {status: 400});
    }

    const date = todayCN();
    const ip = getIP(req);
    const salt = process.env.IP_HASH_SALT || "change-this-salt";
    const ipHash = crypto.createHash("sha256").update(ip + ":" + date + ":" + salt).digest("hex");

    const duplicate = await sql`
      SELECT id FROM posts WHERE post_date = ${date} AND ip_hash = ${ipHash} LIMIT 1
    `;
    if (duplicate.rowCount) {
      return Response.json({error: "你今天已经投稿过了，每个 IP 每天只能投稿一次。"}, {status: 429});
    }

    const result = await sql.query(`
      INSERT INTO posts (post_date, daily_number, content, ip_hash)
      SELECT $1, COALESCE(MAX(daily_number), 0) + 1, $2, $3
      FROM posts
      WHERE post_date = $1
      RETURNING daily_number
    `, [date, content.trim(), ipHash]);

    return Response.json({ok: true, number: result.rows[0].daily_number});
  } catch (e) {
    console.error(e);
    return Response.json({error: "服务器暂时无法处理投稿"}, {status: 500});
  }
}