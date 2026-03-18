"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "loading" | "success" | "error" | "waiting";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><div className="text-[#999]">로딩 중...</div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<Status>(token ? "loading" : "waiting");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("이메일 인증이 완료되었습니다!");
        } else {
          setStatus("error");
          setMessage(data.error || "인증에 실패했습니다.");
        }
      } catch {
        setStatus("error");
        setMessage("인증 처리 중 오류가 발생했습니다.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-[420px]">
        <div className="dc-card p-8 text-center">
          {status === "waiting" && (
            <>
              <div className="text-4xl mb-4">&#9993;</div>
              <h1 className="text-[16px] font-bold mb-2">이메일 인증 대기</h1>
              <p className="text-[13px] text-[#666] mb-1">
                {email ? (
                  <>
                    <span className="font-medium text-[#8b0000]">{email}</span>
                    로 인증 메일을 발송했습니다.
                  </>
                ) : (
                  "인증 메일을 확인해주세요."
                )}
              </p>
              <p className="text-[12px] text-[#999] mt-2">
                메일함을 확인하고 인증 링크를 클릭해주세요.
                <br />
                스팸 메일함도 확인해주세요.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth/signin"
                  className="dc-btn dc-btn-secondary"
                >
                  로그인 페이지로
                </Link>
              </div>
            </>
          )}

          {status === "loading" && (
            <>
              <div className="text-4xl mb-4 animate-spin">&#9881;</div>
              <h1 className="text-[16px] font-bold mb-2">인증 확인 중...</h1>
              <p className="text-[13px] text-[#999]">잠시만 기다려주세요.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-4xl mb-4 text-green-500">&#10004;</div>
              <h1 className="text-[16px] font-bold mb-2 text-green-600">
                {message}
              </h1>
              <p className="text-[13px] text-[#666] mb-4">
                이제 로그인하여 大學大戰을 이용하실 수 있습니다.
              </p>
              <Link
                href="/auth/signin"
                className="dc-btn dc-btn-primary"
              >
                로그인하기
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-4xl mb-4 text-red-500">&#10006;</div>
              <h1 className="text-[16px] font-bold mb-2 text-red-600">
                인증 실패
              </h1>
              <p className="text-[13px] text-[#666] mb-4">{message}</p>
              <div className="flex gap-2 justify-center">
                <Link
                  href="/auth/signup"
                  className="dc-btn dc-btn-secondary"
                >
                  다시 가입하기
                </Link>
                <Link
                  href="/auth/signin"
                  className="dc-btn dc-btn-primary"
                >
                  로그인
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
