import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";

export default async function RankingPage() {
  const universities = await prisma.university.findMany({
    orderBy: { totalPoints: "desc" },
  });

  return (
    <div>
      <h1 className="text-[16px] font-bold text-[var(--primary)] mb-1">
        대학 랭킹
      </h1>
      <p className="text-[12px] text-[#999] mb-4">
        회원 활동을 기반으로 산출된 대학교별 랭킹입니다.
      </p>

      <div className="dc-card overflow-hidden">
        <table className="dc-ranking-table">
          <thead>
            <tr>
              <th className="w-[60px]">순위</th>
              <th>대학교명</th>
              <th className="w-[100px]">총점수</th>
              <th className="w-[80px]">회원수</th>
              <th className="w-[100px]">평균점수</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((uni, i) => {
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
                <tr key={uni.id}>
                  <td className={rankClass}>
                    {rank <= 3 ? (
                      <span className="text-[16px]">
                        {rank === 1 ? "\uD83E\uDD47" : rank === 2 ? "\uD83E\uDD48" : "\uD83E\uDD49"}
                      </span>
                    ) : (
                      rank
                    )}
                  </td>
                  <td className="text-left font-medium">
                    <span className={rankClass}>{uni.name}</span>
                    {uni.shortName && uni.shortName !== uni.name && (
                      <span className="ml-1 text-[11px] text-[#aaa]">
                        ({uni.shortName})
                      </span>
                    )}
                    {uni.region && (
                      <span className="ml-2 text-[11px] text-[#bbb]">
                        {uni.region}
                      </span>
                    )}
                  </td>
                  <td className="font-bold">{formatNumber(uni.totalPoints)}</td>
                  <td>{formatNumber(uni.memberCount)}</td>
                  <td>{uni.avgPoints.toFixed(1)}</td>
                </tr>
              );
            })}
            {universities.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-[#999]">
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
