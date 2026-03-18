"use client";

import { useState } from "react";

interface CommentWriterProps {
  postId: string;
  parentId?: string;
  onSubmitted?: () => void;
  compact?: boolean;
}

export default function CommentWriter({
  postId,
  parentId,
  onSubmitted,
  compact = false,
}: CommentWriterProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: trimmed,
          parentId: parentId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "댓글 등록에 실패했습니다.");
        return;
      }

      setContent("");
      onSubmitted?.();
    } catch {
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex gap-2 ${compact ? "" : "rounded border border-gray-300 bg-[#f8f9fc] p-3"}`}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "답글을 입력하세요." : "댓글을 입력하세요."}
        rows={compact ? 2 : 3}
        className="flex-1 resize-none rounded border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-[#8b0000] focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="shrink-0 rounded bg-[#8b0000] px-4 text-sm font-medium text-white transition-colors hover:bg-[#6b0000] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "등록중..." : "등록"}
      </button>
    </form>
  );
}
