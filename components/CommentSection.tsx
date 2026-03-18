"use client";

import { useState } from "react";

interface CommentAuthor {
  id: string;
  nickname: string;
  university?: { shortName: string | null } | null;
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  upvoteCount: number;
  downvoteCount: number;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  upvoteCount: number;
  downvoteCount: number;
  replies: Reply[];
}

interface CommentSectionProps {
  postId: string;
  gallerySlug: string;
  comments: Comment[];
  isLoggedIn: boolean;
  currentUserId?: string;
}

export function CommentSection({
  postId,
  gallerySlug,
  comments: initialComments,
  isLoggedIn,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;

    const m = String(past.getMonth() + 1).padStart(2, "0");
    const d = String(past.getDate()).padStart(2, "0");
    return `${m}.${d}`;
  };

  const submitComment = async (parentId?: string) => {
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/galleries/${gallerySlug}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          parentId: parentId || undefined,
        }),
      });

      if (res.ok) {
        const newCommentData = await res.json();

        if (parentId) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === parentId
                ? { ...c, replies: [...c.replies, newCommentData] }
                : c
            )
          );
          setReplyContent("");
          setReplyTo(null);
        } else {
          setComments((prev) => [...prev, { ...newCommentData, replies: [] }]);
          setNewComment("");
        }
      } else {
        const data = await res.json();
        alert(data.error || "댓글 작성에 실패했습니다.");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(
        `/api/galleries/${gallerySlug}/posts/${postId}/comments/${commentId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setComments((prev) =>
          prev
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies: c.replies.filter((r) => r.id !== commentId),
            }))
        );
      }
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="dc-card">
      {/* Comment list */}
      {comments.map((comment) => (
        <div key={comment.id}>
          <div className="dc-comment">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] font-medium text-[#333]">
                {comment.author.nickname}
              </span>
              {comment.author.university?.shortName && (
                <span className="badge-university">
                  {comment.author.university.shortName}
                </span>
              )}
              <span className="text-[11px] text-[#bbb]">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-[13px] text-[#444] whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {isLoggedIn && (
                <button
                  onClick={() =>
                    setReplyTo(replyTo === comment.id ? null : comment.id)
                  }
                  className="text-[11px] text-[#999] hover:text-[#8b0000]"
                >
                  답글
                </button>
              )}
              {currentUserId === comment.author.id && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="text-[11px] text-[#ccc] hover:text-red-500"
                >
                  삭제
                </button>
              )}
            </div>

            {/* Reply form */}
            {replyTo === comment.id && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요"
                  className="dc-input flex-1 text-[12px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitComment(comment.id);
                    }
                  }}
                />
                <button
                  onClick={() => submitComment(comment.id)}
                  disabled={loading}
                  className="dc-btn dc-btn-primary text-[11px] px-3"
                >
                  등록
                </button>
              </div>
            )}
          </div>

          {/* Replies */}
          {comment.replies.map((reply) => (
            <div key={reply.id} className="dc-comment dc-comment-reply">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-[#aaa]">&#8627;</span>
                <span className="text-[13px] font-medium text-[#333]">
                  {reply.author.nickname}
                </span>
                {reply.author.university?.shortName && (
                  <span className="badge-university">
                    {reply.author.university.shortName}
                  </span>
                )}
                <span className="text-[11px] text-[#bbb]">
                  {timeAgo(reply.createdAt)}
                </span>
              </div>
              <p className="text-[13px] text-[#444] whitespace-pre-wrap break-words">
                {reply.content}
              </p>
              {currentUserId === reply.author.id && (
                <button
                  onClick={() => deleteComment(reply.id)}
                  className="text-[11px] text-[#ccc] hover:text-red-500 mt-1"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      ))}

      {comments.length === 0 && (
        <div className="p-6 text-center text-[13px] text-[#999]">
          댓글이 없습니다. 첫 번째 댓글을 남겨보세요.
        </div>
      )}

      {/* New comment form */}
      {isLoggedIn ? (
        <div className="p-3 border-t border-[var(--border-color)]">
          <div className="flex gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="dc-input flex-1 text-[13px] resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitComment();
                }
              }}
            />
            <button
              onClick={() => submitComment()}
              disabled={loading}
              className="dc-btn dc-btn-primary self-end disabled:opacity-50"
            >
              {loading ? "등록중" : "등록"}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-[var(--border-color)] text-center text-[12px] text-[#999]">
          댓글을 작성하려면{" "}
          <a href="/auth/signin" className="text-[#8b0000] hover:underline">
            로그인
          </a>
          해주세요.
        </div>
      )}
    </div>
  );
}
