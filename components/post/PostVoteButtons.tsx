"use client";

import { useState } from "react";

interface PostVoteButtonsProps {
  postId: string;
  upvoteCount: number;
  downvoteCount: number;
}

export default function PostVoteButtons({
  postId,
  upvoteCount,
  downvoteCount,
}: PostVoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(upvoteCount);
  const [downvotes, setDownvotes] = useState(downvoteCount);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const handleVote = async (type: "up" | "down") => {
    if (voting || voted) return;
    setVoting(true);

    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "투표에 실패했습니다.");
        return;
      }

      if (type === "up") {
        setUpvotes((prev) => prev + 1);
      } else {
        setDownvotes((prev) => prev + 1);
      }
      setVoted(type);
    } catch {
      alert("투표에 실패했습니다.");
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="my-6 flex items-center justify-center gap-6">
      {/* Upvote (recommend) */}
      <button
        onClick={() => handleVote("up")}
        disabled={voting || voted !== null}
        className={`flex flex-col items-center gap-1 rounded-lg border-2 px-8 py-4 transition-colors ${
          voted === "up"
            ? "border-[#3b4890] bg-[#3b4890] text-white"
            : "border-[#3b4890] bg-white text-[#3b4890] hover:bg-[#eef0f6]"
        } ${voted !== null && voted !== "up" ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-.95-.24l-2.286-1.27A2 2 0 017 17.72V11a2 2 0 01.586-1.414l4.828-4.829A2 2 0 0114 4.172V10z"
          />
        </svg>
        <span className="text-lg font-bold">{upvotes}</span>
        <span className="text-xs font-medium">추천</span>
      </button>

      {/* Downvote (not recommend) */}
      <button
        onClick={() => handleVote("down")}
        disabled={voting || voted !== null}
        className={`flex flex-col items-center gap-1 rounded-lg border-2 px-8 py-4 transition-colors ${
          voted === "down"
            ? "border-[#c53030] bg-[#c53030] text-white"
            : "border-[#c53030] bg-white text-[#c53030] hover:bg-red-50"
        } ${voted !== null && voted !== "down" ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <svg
          className="h-6 w-6 rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-.95-.24l-2.286-1.27A2 2 0 017 17.72V11a2 2 0 01.586-1.414l4.828-4.829A2 2 0 0114 4.172V10z"
          />
        </svg>
        <span className="text-lg font-bold">{downvotes}</span>
        <span className="text-xs font-medium">비추천</span>
      </button>
    </div>
  );
}
