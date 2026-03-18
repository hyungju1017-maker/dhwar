"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="text-[#999]">로딩 중...</div></div>}>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    errorParam === "CredentialsSignin" ? "아이디 또는 비밀번호가 올바르지 않습니다." : ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-12">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#8b0000]">大學大戰</h1>
          <p className="text-sm text-[#999] mt-1">대학생 커뮤니티</p>
        </div>

        <div className="dc-card p-6">
          <h2 className="text-[15px] font-bold mb-4">로그인</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-[12px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-[#666] mb-1">
                아이디
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="dc-input"
                placeholder="아이디를 입력하세요"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#666] mb-1">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="dc-input"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="dc-btn dc-btn-primary w-full h-[40px] mt-2 disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-4 text-center text-[12px] text-[#999]">
            계정이 없으신가요?{" "}
            <Link href="/auth/signup" className="text-[#8b0000] hover:underline font-medium">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
