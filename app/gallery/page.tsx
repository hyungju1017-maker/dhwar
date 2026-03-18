import Link from "next/link";
import { prisma } from "@/lib/prisma";

type GalleryType = "MAJOR" | "MINOR" | "MINI";

export default async function GalleryListPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const activeType: GalleryType = (
    ["MAJOR", "MINOR", "MINI"].includes(params.type || "")
      ? params.type
      : "MAJOR"
  ) as GalleryType;

  const galleries = await prisma.gallery.findMany({
    where: { isActive: true, type: activeType },
    orderBy: { todayPostCount: "desc" },
    include: { category: true },
  });

  const categorized = galleries.reduce(
    (acc, g) => {
      const cat = g.category?.name || "기타";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(g);
      return acc;
    },
    {} as Record<string, typeof galleries>
  );

  const typeLabels: Record<GalleryType, string> = {
    MAJOR: "주요 게시판",
    MINOR: "마이너 게시판",
    MINI: "미니 게시판",
  };

  return (
    <div>
      <h1 className="text-[16px] font-bold mb-3">게시판 목록</h1>

      {/* Tabs */}
      <div className="dc-tabs">
        {(["MAJOR", "MINOR", "MINI"] as GalleryType[]).map((type) => (
          <Link
            key={type}
            href={`/gallery?type=${type}`}
            className={`dc-tab ${activeType === type ? "dc-tab-active" : ""}`}
          >
            {typeLabels[type]}
          </Link>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="dc-card mt-0 rounded-t-none">
        {Object.keys(categorized).length > 0 ? (
          Object.entries(categorized).map(([catName, galleryList]) => (
            <div key={catName} className="border-b border-[var(--border-color)] last:border-b-0">
              <div className="bg-[#f9f9f9] px-3 py-2 text-[12px] font-bold text-[#666]">
                {catName}
                <span className="ml-1 text-[#aaa] font-normal">({galleryList.length})</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {galleryList.map((gallery) => (
                  <Link
                    key={gallery.id}
                    href={`/gallery/${gallery.slug}`}
                    className="flex items-center justify-between px-3 py-[7px] text-[13px] hover:bg-[#f5f5f5] border-b border-[#f0f0f0]"
                  >
                    <span className="text-[#333] truncate">{gallery.name}</span>
                    <span className="flex items-center gap-2">
                      {gallery.todayPostCount > 0 && (
                        <span className="text-[11px] text-red-500 font-bold">
                          {gallery.todayPostCount}
                        </span>
                      )}
                      <span className="text-[11px] text-[#ccc]">
                        총 {gallery.postCount}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-[#999]">
            등록된 게시판가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
