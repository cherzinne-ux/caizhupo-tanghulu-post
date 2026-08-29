import "./globals.css";

export const metadata = {
  title: "每日投稿",
  description: "每日投稿墙",
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}