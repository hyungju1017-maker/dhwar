export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  const y = past.getFullYear();
  const m = String(past.getMonth() + 1).padStart(2, "0");
  const d = String(past.getDate()).padStart(2, "0");
  const h = String(past.getHours()).padStart(2, "0");
  const min = String(past.getMinutes()).padStart(2, "0");

  if (y === now.getFullYear()) return `${m}.${d} ${h}:${min}`;
  return `${y}.${m}.${d}`;
}

export function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return n.toString();
}

export function extractDomain(email: string): string {
  return email.split("@")[1] || "";
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getPostTypeLabel(type: string): string {
  switch (type) {
    case "CONCEPT": return "개념글";
    case "NOTICE": return "공지";
    case "RECOMMEND": return "추천";
    default: return "";
  }
}
