"use client";

import { useState } from "react";

interface VoteButtonsProps {
  postId: string;
  upvoteCount: number;
  downvoteCount: number;
  userVote: number | null;
  isLoggedIn: boolean;
}

export function VoteButtons({
  postId,
  upvoteCount: initialUp,
  downvoteCount: initialDown,
  userVote: initialVote,
  isLoggedIn,
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUp);
  const [downvotes, setDownvotes] = useState(initialDown);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [loading, setLoading] = useState(false);

  const handleVote = async (value: 1 | -1) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (loading) return;
    if (currentVote !== null) {
      alert("이미 투표하셨습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/galleries/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, value }),
      });

      if (res.ok) {
        if (value === 1) {
          setUpvotes((v) => v + 1);
        } else {
          setDownvotes((v) => v + 1);
        }
        setCurrentVote(value);
      } else {
        const data = await res.json();
        alert(data.error || "투표에 실패했습니다.");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => handleVote(1)}
        disabled={loading || currentVote !== null}
        className={`vote-btn vote-btn-up ${
          currentVote === 1 ? "bg-[#8b0000] text-white border-[#8b0000]" : ""
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <span>&#9650;</span>
        <span>추천</span>
        <span className="font-bold">{upvotes}</span>
      </button>
      <button
        onClick={() => handleVote(-1)}
        disabled={loading || currentVote !== null}
        className={`vote-btn vote-btn-down ${
          currentVote === -1 ? "bg-[#666] text-white border-[#666]" : ""
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <span>&#9660;</span>
        <span>비추</span>
        <span className="font-bold">{downvotes}</span>
      </button>
    </>
  );
}
