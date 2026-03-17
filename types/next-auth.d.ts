import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      nickname: string;
      email: string;
      universityId: string;
      universityName: string;
      universityShortName: string;
      points: number;
      isAdmin: boolean;
    };
  }

  interface User {
    id: string;
    username: string;
    nickname: string;
    email: string;
    universityId: string;
    universityName: string;
    universityShortName: string;
    points: number;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    nickname: string;
    universityId: string;
    universityName: string;
    universityShortName: string;
    points: number;
    isAdmin: boolean;
  }
}
