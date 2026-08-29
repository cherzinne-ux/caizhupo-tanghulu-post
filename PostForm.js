 "use client";

import { useState } from "react";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!content.trim()) return setStatus("请输入投稿内容");
    setStatus("正在投稿…");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: content.trim()})
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`投稿成功，你是今天的 #${data.number} 号`);
      setContent("");
      setTimeout(() => location.reload(), 500);
    } else {
      setStatus(data.error || "投稿失败，请稍后再试");
    }
  }

  return <form className="composer" onSubmit={submit}>
    <textarea
      value={content}
      onChange={e => setContent(e.target.value)}
      maxLength={500}
      placeholder="写下今天想说的话……（最多 500 字）"
    />
    <div className="composerBottom">
      <span>{content.length}/500 · 每个 IP 每天限投稿 1 次</span>
      <button type="submit">投稿</button>
    </div>
    {status && <div className="status">{status}</div>}
  </form>;
}