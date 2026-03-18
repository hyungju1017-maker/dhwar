import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";

export default async function UserRankingPage() {
  const users = await prisma.user.findMany({
    where: { isBanned: false, emailVerified: { not: null } },
    orderBy: { points: "desc" },
    take: 100,
    select: {
      id: true,
      nickname: true,
      points: true,
      totalUpvotes: true,
      totalDownvotes: true,
      university: {
        select: { name: true, shortName: true },
      },
      createdAt: true,
    },
  });

  return (
    <div>
      <h1 className="text-[16px] font-bold text-[#8b0000] mb-1">
        유저 랭킹
      </h1>
      <p className="text-[12px] text-[#999] mb-4">
        활동 점수 기준 상위 100명의 유저 랭킹입니다.
      </p>

      <div className="dc-card overflow-hidden">
        <table className="dc-ranking-table">
          <thead>
            <tr>
              <th className="w-[60px]">순위</th>
              <th>닉네임</th>
              <th className="w-[120px]">대학교</th>
              <th className="w-[80px]">포인트</th>
              <th className="w-[70px]">추천받은수</th>
              <th className="w-[70px]">비추받은수</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              const rank = i + 1;
              const rankClass =
                rank === 1
                  ? "rank-1"
                  : rank === 2
                  ? "rank-2"
                  : rank === 3
                  ? "rank-3"
                  : "";
              return (
                <tr key={user.id}>
                  <td className={rankClass}>
                    {rank <= 3 ? (
                      <span className="text-[16px]">
                        {rank === 1 ? "\uD83E\uDD47" : rank === 2 ? "\uD83E\uDD48" : "\uD83E\uDD49"}
                      </span>
                    ) : (
                      rank
                    )}
                  </td>
                  <td className="font-medium">
                    <span className={rankClass}>{user.nickname}</span>
                  </td>
                  <td>
                    <span className="text-[12px]">
                      {user.university.shortName || user.university.name}
                    </span>
                  </td>
                  <td className="font-bold">{formatNumber(user.points)}</td>
                  <td className="text-[#8b0000]">
                    {formatNumber(user.totalUpvotes)}
                  </td>
                  <td className="text-[#999]">
                    {formatNumber(user.totalDownvotes)}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-[#999]">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
