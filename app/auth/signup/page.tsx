"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UNIVERSITY_DOMAINS } from "@/lib/constants";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDomains, setShowDomains] = useState(false);

  const supportedDomains = Object.entries(UNIVERSITY_DOMAINS);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): string | null => {
    if (form.username.length < 4 || form.username.length > 20) {
      return "아이디는 4~20자로 입력해주세요.";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      return "아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다.";
    }
    if (form.nickname.length < 2 || form.nickname.length > 12) {
      return "닉네임은 2~12자로 입력해주세요.";
    }
    if (!form.email.includes("@")) {
      return "올바른 이메일 형식이 아닙니다.";
    }
    const domain = form.email.split("@")[1];
    if (!UNIVERSITY_DOMAINS[domain]) {
      return "지원되지 않는 대학 이메일 도메인입니다.";
    }
    if (form.password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }
    if (form.password !== form.confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          nickname: form.nickname,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "회원가입에 실패했습니다.");
        return;
      }

      router.push("/auth/verify-email?email=" + encodeURIComponent(form.email));
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#8b0000]">大學大戰</h1>
          <p className="text-sm text-[#999] mt-1">회원가입</p>
        </div>

        <div className="dc-card p-6">
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
                name="username"
                value={form.username}
                onChange={handleChange}
                className="dc-input"
                placeholder="영문, 숫자, 밑줄 4~20자"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#666] mb-1">
                닉네임
              </label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className="dc-input"
                placeholder="2~12자"
                required
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#666] mb-1">
                대학 이메일
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="dc-input"
                placeholder="example@university.ac.kr"
                required
              />
              <button
                type="button"
                onClick={() => setShowDomains(!showDomains)}
                className="text-[11px] text-[#8b0000] mt-1 hover:underline"
              >
                {showDomains ? "지원 대학 접기 ▲" : "지원 대학 목록 보기 ▼"}
              </button>
              {showDomains && (
                <div className="mt-2 max-h-[200px] overflow-y-auto border border-[var(--border-color)] rounded p-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {supportedDomains.map(([domain, name]) => (
                      <div key={domain} className="text-[11px] text-[#666]">
                        <span className="font-medium">{name}</span>
                        <span className="text-[#aaa] ml-1">@{domain}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#666] mb-1">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="dc-input"
                placeholder="8자 이상"
                required
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#666] mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="dc-input"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="dc-btn dc-btn-primary w-full h-[40px] mt-2 disabled:opacity-50"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-4 text-center text-[12px] text-[#999]">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/signin" className="text-[#8b0000] hover:underline font-medium">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
