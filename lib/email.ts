import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@dhwar.com",
    to: email,
    subject: "[DHWAR] 대학 이메일 인증",
    html: `
      <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b4890;">DHWAR 이메일 인증</h2>
        <p>아래 버튼을 클릭하여 이메일 인증을 완료해주세요.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #3b4890; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">이메일 인증하기</a>
        <p style="color: #666; font-size: 12px;">이 링크는 24시간 동안 유효합니다.</p>
      </div>
    `,
  });
}
