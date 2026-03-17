import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: { university: true },
        });

        if (!user) return null;
        if (!user.emailVerified) return null;
        if (user.isBanned) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          universityId: user.universityId,
          universityName: user.university.name,
          universityShortName: user.university.shortName || user.university.name,
          points: user.points,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.nickname = (user as any).nickname;
        token.universityId = (user as any).universityId;
        token.universityName = (user as any).universityName;
        token.universityShortName = (user as any).universityShortName;
        token.points = (user as any).points;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).nickname = token.nickname;
        (session.user as any).universityId = token.universityId;
        (session.user as any).universityName = token.universityName;
        (session.user as any).universityShortName = token.universityShortName;
        (session.user as any).points = token.points;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
};
