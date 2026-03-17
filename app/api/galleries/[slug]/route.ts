import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const gallery = await prisma.gallery.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!gallery || !gallery.isActive) {
      return NextResponse.json(
        { error: "갤러리를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { error: "갤러리 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
