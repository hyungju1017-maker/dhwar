"use client";

import { useEffect, useState } from "react";
import UniversityBadge from "../ui/UniversityBadge";
import CommentWriter from "./CommentWriter";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  upvoteCount: number;
  downvoteCount: number;
  parentId: string | null;
  author: {
    nickname: string;
    universityName: string;
    universityShortName: string;
  };
  replies?: Comment[];
}

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments ?? data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleVoteComment = async (commentId: string, type: "up" | "down") => {
    try {
      const res = await fetch(`/api/comments/${commentId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        fetchComments();
      } else {
        const data = await res.json();
        alert(data.message || "투표에 실패했습니다.");
      }
    } catch {
      alert("투표에 실패했습니다.");
    }
  };

  // Build nested structure: top-level comments with nested replies
  const topLevel = comments.filter((c) => !c.parentId);
  const repliesMap = new Map<string, Comment[]>();
  comments
    .filter((c) => c.parentId)
    .forEach((c) => {
      const arr = repliesMap.get(c.parentId!) || [];
      arr.push(c);
      repliesMap.set(c.parentId!, arr);
    });

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`${isReply ? "ml-8 border-l-2 border-[#e0e3ed] pl-3" : ""} border-b border-gray-200 py-2.5`}
    >
      <div className="flex items-center gap-2">
        <UniversityBadge
          name={comment.author.universityName}
          shortName={comment.author.universityShortName}
        />
        <span className="text-xs font-bold text-gray-800">
          {comment.author.nickname}
        </span>
        <span className="text-[10px] text-gray-400">
          {formatTime(comment.createdAt)}
        </span>
      </div>

      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
        {comment.content}
      </p>

      <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-400">
        <button
          onClick={() => handleVoteComment(comment.id, "up")}
          className="hover:text-[#8b0000]"
        >
          추천 {comment.upvoteCount > 0 ? comment.upvoteCount : ""}
        </button>
        <button
          onClick={() => handleVoteComment(comment.id, "down")}
          className="hover:text-red-500"
        >
          비추 {comment.downvoteCount > 0 ? comment.downvoteCount : ""}
        </button>
        {!isReply && (
          <button
            onClick={() =>
              setReplyingTo(replyingTo === comment.id ? null : comment.id)
            }
            className="hover:text-[#8b0000]"
          >
            답글
          </button>
        )}
      </div>

      {/* Inline reply form */}
      {replyingTo === comment.id && (
        <div className="mt-2">
          <CommentWriter
            postId={postId}
            parentId={comment.id}
            onSubmitted={() => {
              setReplyingTo(null);
              fetchComments();
            }}
            compact
          />
        </div>
      )}

      {/* Nested replies */}
      {(comment.replies || repliesMap.get(comment.id) || []).map((reply) =>
        renderComment(reply, true),
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="py-6 text-center text-sm text-gray-400">
        댓글을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-2 border-b-2 border-[#8b0000] pb-1">
        <h3 className="text-sm font-bold text-[#8b0000]">
          댓글{" "}
          <span className="text-gray-500">[{comments.length}]</span>
        </h3>
      </div>

      {topLevel.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          등록된 댓글이 없습니다.
        </p>
      ) : (
        topLevel.map((c) => renderComment(c))
      )}

      {/* Comment writer at the bottom */}
      <div className="mt-4">
        <CommentWriter postId={postId} onSubmitted={fetchComments} />
      </div>
    </div>
  );
}
