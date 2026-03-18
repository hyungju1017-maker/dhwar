"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function WritePostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="flex justify-center py-16">
        <p className="text-[13px] text-[#999]">로딩 중...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center py-16">
        <div className="dc-card p-8 text-center max-w-[360px]">
          <p className="text-[14px] font-medium mb-4">로그인이 필요합니다.</p>
          <Link href="/auth/signin" className="dc-btn dc-btn-primary">
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/galleries/${slug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "글 작성에 실패했습니다.");
        return;
      }

      router.push(`/gallery/${slug}/${data.id}`);
    } catch {
      setError("글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[16px] font-bold">글쓰기</h1>
        <Link
          href={`/gallery/${slug}`}
          className="text-[12px] text-[#999] hover:text-[#8b0000]"
        >
          &larr; 목록으로
        </Link>
      </div>

      <div className="dc-card p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-[12px] text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dc-input text-[14px] font-medium"
              placeholder="제목을 입력하세요"
              maxLength={100}
              autoFocus
            />
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="dc-textarea"
              placeholder="내용을 입력하세요"
              rows={15}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#aaa]">
              작성자: {(session.user as any)?.nickname || "익명"}
            </span>
            <div className="flex gap-2">
              <Link href={`/gallery/${slug}`} className="dc-btn dc-btn-secondary">
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="dc-btn dc-btn-primary disabled:opacity-50"
              >
                {loading ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
