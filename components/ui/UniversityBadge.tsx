interface UniversityBadgeProps {
  name: string;
  shortName: string;
}

// Deterministic color based on university name
const BADGE_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" },
  { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" },
  { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300" },
  { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300" },
];

// Well-known universities get fixed colors
const FIXED_COLORS: Record<string, typeof BADGE_COLORS[number]> = {
  "서울대학교": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-400" },
  "연세대학교": { bg: "bg-sky-100", text: "text-sky-800", border: "border-sky-400" },
  "고려대학교": { bg: "bg-red-100", text: "text-red-800", border: "border-red-400" },
  "KAIST": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-400" },
  "포항공과대학교": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-400" },
  "성균관대학교": { bg: "bg-green-100", text: "text-green-800", border: "border-green-400" },
  "한양대학교": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-400" },
  "이화여자대학교": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-400" },
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function UniversityBadge({ name, shortName }: UniversityBadgeProps) {
  const color =
    FIXED_COLORS[name] || BADGE_COLORS[hashCode(name) % BADGE_COLORS.length];

  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold leading-none ${color.bg} ${color.text} ${color.border}`}
      title={name}
    >
      {shortName}
    </span>
  );
}
