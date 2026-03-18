import Link from "next/link";
import UniversityBadge from "../ui/UniversityBadge";

interface Post {
  id: string;
  number: number;
  title: string;
  commentCount: number;
  author: {
    nickname: string;
    universityName: string;
    universityShortName: string;
  };
  isConcept: boolean;
  createdAt: string;
  viewCount: number;
  upvoteCount: number;
}

interface PostListProps {
  posts: Post[];
  gallerySlug: string;
}

export default function PostList({ posts, gallerySlug }: PostListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isToday) {
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
    return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-xs">
        <thead>
          <tr className="border-b-2 border-[#8b0000] bg-[#fde8e8] text-gray-600">
            <th className="w-[60px] px-2 py-2 text-center font-medium">
              번호
            </th>
            <th className="px-2 py-2 text-left font-medium">제목</th>
            <th className="w-[120px] px-2 py-2 text-center font-medium">
              글쓴이
            </th>
            <th className="w-[65px] px-2 py-2 text-center font-medium">
              작성일
            </th>
            <th className="w-[45px] px-2 py-2 text-center font-medium">
              조회
            </th>
            <th className="w-[45px] px-2 py-2 text-center font-medium">
              추천
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-sm text-gray-400"
              >
                게시글이 없습니다.
              </td>
            </tr>
          )}
          {posts.map((post) => (
            <tr
              key={post.id}
              className={`border-b border-gray-200 hover:bg-[#f8f9fc] ${post.isConcept ? "bg-[#fff9f0]" : ""}`}
            >
              <td className="px-2 py-1.5 text-center text-gray-400">
                {post.isConcept ? (
                  <span className="font-bold text-[#e8770c]">개념</span>
                ) : (
                  post.number
                )}
              </td>
              <td className="px-2 py-1.5">
                <Link
                  href={`/gallery/${gallerySlug}/${post.id}`}
                  className={`hover:underline ${post.isConcept ? "font-bold text-[#e8770c]" : "text-gray-900"}`}
                >
                  {post.title}
                  {post.commentCount > 0 && (
                    <span className="ml-1 font-bold text-[#8b0000]">
                      [{post.commentCount}]
                    </span>
                  )}
                </Link>
              </td>
              <td className="px-2 py-1.5 text-center">
                <div className="flex items-center justify-center gap-1">
                  <UniversityBadge
                    name={post.author.universityName}
                    shortName={post.author.universityShortName}
                  />
                  <span className="text-gray-700">{post.author.nickname}</span>
                </div>
              </td>
              <td className="px-2 py-1.5 text-center text-gray-500">
                {formatDate(post.createdAt)}
              </td>
              <td className="px-2 py-1.5 text-center text-gray-500">
                {post.viewCount}
              </td>
              <td className="px-2 py-1.5 text-center text-gray-500">
                {post.upvoteCount > 0 ? post.upvoteCount : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
