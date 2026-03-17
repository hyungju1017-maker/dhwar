import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { UNIVERSITY_DOMAINS } from "@/lib/constants";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { username, nickname, email, password } = await request.json();

    if (!username || !nickname || !email || !password) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    // Validate email domain
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (!emailDomain || !UNIVERSITY_DOMAINS[emailDomain]) {
      return NextResponse.json(
        { error: "지원되는 대학 이메일이 아닙니다." },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { nickname }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "이미 사용 중인 아이디입니다." },
          { status: 409 }
        );
      }
      if (existingUser.nickname === nickname) {
        return NextResponse.json(
          { error: "이미 사용 중인 닉네임입니다." },
          { status: 409 }
        );
      }
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "이미 가입된 이메일입니다." },
          { status: 409 }
        );
      }
    }

    const universityName = UNIVERSITY_DOMAINS[emailDomain];

    // Find or create university
    const university = await prisma.university.upsert({
      where: { domain: emailDomain },
      update: {},
      create: {
        name: universityName,
        domain: emailDomain,
      },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        nickname,
        email,
        password: hashedPassword,
        universityId: university.id,
      },
    });

    // Update university member count
    await prisma.university.update({
      where: { id: university.id },
      data: { memberCount: { increment: 1 } },
    });

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.emailVerificationToken.create({
      data: {
        token,
        email,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다. 이메일 인증을 진행해주세요." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
