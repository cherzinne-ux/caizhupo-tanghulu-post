import { sql } from "@vercel/postgres";
import PostForm from "./PostForm";

function dateCN(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric", month: "long", day: "numeric", weekday: "long"
  }).format(date);
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());

  let posts = [];
  let dates = [];
  try {
    const p = await sql`
      SELECT daily_number, content, created_at
      FROM posts WHERE post_date = ${today}
      ORDER BY daily_number ASC
    `;
    posts = p.rows;
    const d = await sql`
      SELECT post_date, COUNT(*)::int AS count
      FROM posts GROUP BY post_date ORDER BY post_date DESC LIMIT 90
    `;
    dates = d.rows;
  } catch (_) {}

  return (
    <main className="page">
      <header>
        <div>
          
          <h1>彩猪婆“糖葫芦”投稿</h1>
          <p className="date">{dateCN(new Date())}</p>
        </div>
        <div className="count">今日 {posts.length} 条</div>
      </header>

      <PostForm />

      <section className="archive">
        <h2>历史日期</h2>
        <div className="dates">
          {dates.length ? dates.map(d => (
            <a key={d.post_date} href={"/?date=" + d.post_date}>
              {d.post_date} <span>{d.count}</span>
            </a>
          )) : <p className="muted">投稿后会自动形成日期档案。</p>}
        </div>
      </section>

      <section className="posts">
        {posts.length ? posts.map(p => (
          <article className="post" key={p.daily_number}>
            <div className="number">#{p.daily_number}</div>
            <div className="content">{p.content}</div>
            <time>{new Date(p.created_at).toLocaleTimeString("zh-CN", {
              timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit"
            })}</time>
          </article>
        )) : <div className="empty">今天还没有投稿，成为第 1 号吧。</div>}
      </section>
    </main>
  );
}
