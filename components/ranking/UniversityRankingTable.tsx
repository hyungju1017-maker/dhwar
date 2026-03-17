interface University {
  id: string;
  rank: number;
  name: string;
  totalPoints: number;
  memberCount: number;
  averagePoints: number;
}

interface UniversityRankingTableProps {
  universities: University[];
}

export default function UniversityRankingTable({
  universities,
}: UniversityRankingTableProps) {
  const medalColors: Record<number, string> = {
    1: "text-yellow-500",
    2: "text-gray-400",
    3: "text-amber-700",
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[500px] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-[#3b4890] bg-[#eef0f6] text-gray-600">
            <th className="w-[60px] px-3 py-2.5 text-center font-medium">
              순위
            </th>
            <th className="px-3 py-2.5 text-left font-medium">대학명</th>
            <th className="w-[100px] px-3 py-2.5 text-center font-medium">
              총점
            </th>
            <th className="w-[80px] px-3 py-2.5 text-center font-medium">
              회원수
            </th>
            <th className="w-[90px] px-3 py-2.5 text-center font-medium">
              평균점수
            </th>
          </tr>
        </thead>
        <tbody>
          {universities.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-10 text-center text-sm text-gray-400"
              >
                데이터가 없습니다.
              </td>
            </tr>
          )}
          {universities.map((uni) => (
            <tr
              key={uni.id}
              className={`border-b border-gray-200 hover:bg-[#f8f9fc] ${uni.rank <= 3 ? "bg-[#fafaf5]" : ""}`}
            >
              <td
                className={`px-3 py-2 text-center font-bold ${medalColors[uni.rank] || "text-gray-400"}`}
              >
                {uni.rank}
              </td>
              <td className="px-3 py-2 font-medium text-gray-900">
                {uni.name}
              </td>
              <td className="px-3 py-2 text-center text-[#3b4890]">
                {uni.totalPoints.toLocaleString()}
              </td>
              <td className="px-3 py-2 text-center text-gray-600">
                {uni.memberCount.toLocaleString()}
              </td>
              <td className="px-3 py-2 text-center text-gray-600">
                {uni.averagePoints.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
