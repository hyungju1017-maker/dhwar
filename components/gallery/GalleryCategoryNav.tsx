import Link from "next/link";

interface Category {
  slug: string;
  name: string;
}

interface GalleryCategoryNavProps {
  categories: Category[];
  activeSlug?: string;
}

export default function GalleryCategoryNav({
  categories,
  activeSlug,
}: GalleryCategoryNavProps) {
  return (
    <nav className="border-b-2 border-[#3b4890]">
      <ul className="flex flex-wrap">
        <li>
          <Link
            href="/gallery"
            className={`inline-block border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              !activeSlug
                ? "border-[#3b4890] text-[#3b4890]"
                : "border-transparent text-gray-500 hover:text-[#3b4890]"
            }`}
          >
            전체
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/gallery/${cat.slug}`}
              className={`inline-block border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeSlug === cat.slug
                  ? "border-[#3b4890] text-[#3b4890]"
                  : "border-transparent text-gray-500 hover:text-[#3b4890]"
              }`}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
