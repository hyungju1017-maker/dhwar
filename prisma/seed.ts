import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool, { schema: "dhwar" });
const prisma = new PrismaClient({ adapter });

// ==================== UNIVERSITIES ====================

const universities: {
  domain: string;
  name: string;
  shortName: string;
  region: string;
}[] = [
  { domain: "snu.ac.kr", name: "서울대학교", shortName: "서울대", region: "서울" },
  { domain: "yonsei.ac.kr", name: "연세대학교", shortName: "연세대", region: "서울" },
  { domain: "korea.ac.kr", name: "고려대학교", shortName: "고려대", region: "서울" },
  { domain: "kaist.ac.kr", name: "KAIST", shortName: "KAIST", region: "대전" },
  { domain: "postech.ac.kr", name: "포항공과대학교", shortName: "포항공대", region: "경북" },
  { domain: "skku.edu", name: "성균관대학교", shortName: "성균관대", region: "서울" },
  { domain: "hanyang.ac.kr", name: "한양대학교", shortName: "한양대", region: "서울" },
  { domain: "sogang.ac.kr", name: "서강대학교", shortName: "서강대", region: "서울" },
  { domain: "cau.ac.kr", name: "중앙대학교", shortName: "중앙대", region: "서울" },
  { domain: "khu.ac.kr", name: "경희대학교", shortName: "경희대", region: "서울" },
  { domain: "hufs.ac.kr", name: "한국외국어대학교", shortName: "한국외대", region: "서울" },
  { domain: "uos.ac.kr", name: "서울시립대학교", shortName: "서울시립대", region: "서울" },
  { domain: "konkuk.ac.kr", name: "건국대학교", shortName: "건국대", region: "서울" },
  { domain: "dongguk.edu", name: "동국대학교", shortName: "동국대", region: "서울" },
  { domain: "sejong.ac.kr", name: "세종대학교", shortName: "세종대", region: "서울" },
  { domain: "sungshin.ac.kr", name: "성신여자대학교", shortName: "성신여대", region: "서울" },
  { domain: "duksung.ac.kr", name: "덕성여자대학교", shortName: "덕성여대", region: "서울" },
  { domain: "sookmyung.ac.kr", name: "숙명여자대학교", shortName: "숙명여대", region: "서울" },
  { domain: "ewha.ac.kr", name: "이화여자대학교", shortName: "이화여대", region: "서울" },
  { domain: "hongik.ac.kr", name: "홍익대학교", shortName: "홍익대", region: "서울" },
  { domain: "kookmin.ac.kr", name: "국민대학교", shortName: "국민대", region: "서울" },
  { domain: "kwangwoon.ac.kr", name: "광운대학교", shortName: "광운대", region: "서울" },
  { domain: "mju.ac.kr", name: "명지대학교", shortName: "명지대", region: "서울" },
  { domain: "inha.ac.kr", name: "인하대학교", shortName: "인하대", region: "경기" },
  { domain: "ajou.ac.kr", name: "아주대학교", shortName: "아주대", region: "경기" },
  { domain: "gachon.ac.kr", name: "가천대학교", shortName: "가천대", region: "경기" },
  { domain: "dankook.ac.kr", name: "단국대학교", shortName: "단국대", region: "경기" },
  { domain: "catholic.ac.kr", name: "가톨릭대학교", shortName: "가톨릭대", region: "경기" },
  { domain: "pusan.ac.kr", name: "부산대학교", shortName: "부산대", region: "부산" },
  { domain: "knu.ac.kr", name: "경북대학교", shortName: "경북대", region: "대구" },
  { domain: "jnu.ac.kr", name: "전남대학교", shortName: "전남대", region: "광주" },
  { domain: "cnu.ac.kr", name: "충남대학교", shortName: "충남대", region: "대전" },
  { domain: "cbnu.ac.kr", name: "충북대학교", shortName: "충북대", region: "충북" },
  { domain: "gnu.ac.kr", name: "경상국립대학교", shortName: "경상대", region: "경남" },
  { domain: "kangwon.ac.kr", name: "강원대학교", shortName: "강원대", region: "강원" },
  { domain: "jejunu.ac.kr", name: "제주대학교", shortName: "제주대", region: "제주" },
  { domain: "jbnu.ac.kr", name: "전북대학교", shortName: "전북대", region: "전북" },
  { domain: "unist.ac.kr", name: "울산과학기술원", shortName: "UNIST", region: "울산" },
  { domain: "gist.ac.kr", name: "광주과학기술원", shortName: "GIST", region: "광주" },
  { domain: "dgist.ac.kr", name: "대구경북과학기술원", shortName: "DGIST", region: "대구" },
  { domain: "pknu.ac.kr", name: "부경대학교", shortName: "부경대", region: "부산" },
];

// ==================== GALLERY CATEGORIES ====================

const galleryCategories: { slug: string; name: string; order: number }[] = [
  { slug: "game", name: "게임", order: 1 },
  { slug: "sports", name: "스포츠", order: 2 },
  { slug: "entertainment", name: "연예", order: 3 },
  { slug: "comics-anime", name: "만화/애니", order: 4 },
  { slug: "broadcast", name: "방송", order: 5 },
  { slug: "it", name: "IT", order: 6 },
  { slug: "politics-social", name: "정치/사회", order: 7 },
  { slug: "food", name: "음식/요리", order: 8 },
  { slug: "travel", name: "여행", order: 9 },
  { slug: "sports-hobby", name: "스포츠/레저", order: 10 },
  { slug: "car", name: "자동차", order: 11 },
  { slug: "music", name: "음악", order: 12 },
  { slug: "animal", name: "동물", order: 13 },
  { slug: "fashion", name: "패션", order: 14 },
  { slug: "movie-drama", name: "영화/드라마", order: 15 },
  { slug: "humor", name: "유머", order: 16 },
  { slug: "stock", name: "주식", order: 17 },
  { slug: "university", name: "대학교", order: 18 },
];

// ==================== GALLERIES ====================

const galleries: {
  slug: string;
  name: string;
  categorySlug: string;
  description?: string;
}[] = [
  // ---- Games ----
  { slug: "lol", name: "리그 오브 레전드", categorySlug: "game", description: "리그 오브 레전드 게시판" },
  { slug: "overwatch", name: "오버워치", categorySlug: "game", description: "오버워치 게시판" },
  { slug: "maplestory", name: "메이플스토리", categorySlug: "game", description: "메이플스토리 게시판" },
  { slug: "starcraft", name: "스타크래프트", categorySlug: "game", description: "스타크래프트 게시판" },
  { slug: "valorant", name: "발로란트", categorySlug: "game", description: "발로란트 게시판" },
  { slug: "minecraft", name: "마인크래프트", categorySlug: "game", description: "마인크래프트 게시판" },
  { slug: "genshin", name: "원신", categorySlug: "game", description: "원신 게시판" },
  { slug: "fifa", name: "FC 온라인", categorySlug: "game", description: "FC 온라인 게시판" },
  { slug: "pubg", name: "배틀그라운드", categorySlug: "game", description: "배틀그라운드 게시판" },
  { slug: "diablo", name: "디아블로", categorySlug: "game", description: "디아블로 게시판" },
  { slug: "lostark", name: "로스트아크", categorySlug: "game", description: "로스트아크 게시판" },

  // ---- Sports ----
  { slug: "baseball", name: "야구", categorySlug: "sports", description: "야구 게시판" },
  { slug: "soccer", name: "해외축구", categorySlug: "sports", description: "해외축구 게시판" },
  { slug: "basketball", name: "농구", categorySlug: "sports", description: "농구 게시판" },
  { slug: "kbaseball", name: "국내야구", categorySlug: "sports", description: "국내야구 게시판" },
  { slug: "ksoccer", name: "국내축구", categorySlug: "sports", description: "국내축구 게시판" },
  { slug: "volleyball", name: "배구", categorySlug: "sports", description: "배구 게시판" },
  { slug: "esports", name: "e스포츠", categorySlug: "sports", description: "e스포츠 게시판" },

  // ---- Entertainment ----
  { slug: "ive", name: "IVE", categorySlug: "entertainment", description: "IVE 게시판" },
  { slug: "newjeans", name: "NewJeans", categorySlug: "entertainment", description: "NewJeans 게시판" },
  { slug: "aespa", name: "에스파", categorySlug: "entertainment", description: "에스파 게시판" },
  { slug: "bts", name: "방탄소년단", categorySlug: "entertainment", description: "방탄소년단 게시판" },
  { slug: "blackpink", name: "블랙핑크", categorySlug: "entertainment", description: "블랙핑크 게시판" },
  { slug: "lesserafim", name: "르세라핌", categorySlug: "entertainment", description: "르세라핌 게시판" },
  { slug: "stayc", name: "STAYC", categorySlug: "entertainment", description: "STAYC 게시판" },
  { slug: "seventeen", name: "세븐틴", categorySlug: "entertainment", description: "세븐틴 게시판" },
  { slug: "nct", name: "NCT", categorySlug: "entertainment", description: "NCT 게시판" },

  // ---- Comics/Anime ----
  { slug: "onepiece", name: "원피스", categorySlug: "comics-anime", description: "원피스 게시판" },
  { slug: "naruto", name: "나루토", categorySlug: "comics-anime", description: "나루토 게시판" },
  { slug: "demonslayer", name: "귀멸의 칼날", categorySlug: "comics-anime", description: "귀멸의 칼날 게시판" },
  { slug: "anime", name: "애니메이션", categorySlug: "comics-anime", description: "애니메이션 게시판" },
  { slug: "manga", name: "만화", categorySlug: "comics-anime", description: "만화 게시판" },
  { slug: "webtoon", name: "웹툰", categorySlug: "comics-anime", description: "웹툰 게시판" },

  // ---- IT ----
  { slug: "programming", name: "프로그래밍", categorySlug: "it", description: "프로그래밍 게시판" },
  { slug: "smartphone", name: "스마트폰", categorySlug: "it", description: "스마트폰 게시판" },
  { slug: "pc-hardware", name: "PC 하드웨어", categorySlug: "it", description: "PC 하드웨어 게시판" },
  { slug: "apple", name: "애플", categorySlug: "it", description: "애플 게시판" },
  { slug: "samsung", name: "삼성", categorySlug: "it", description: "삼성 게시판" },

  // ---- Politics/Social ----
  { slug: "domestic-politics", name: "국내정치", categorySlug: "politics-social", description: "국내정치 게시판" },
  { slug: "international", name: "국제", categorySlug: "politics-social", description: "국제 게시판" },

  // ---- Food ----
  { slug: "cooking", name: "요리", categorySlug: "food", description: "요리 게시판" },
  { slug: "restaurant", name: "맛집", categorySlug: "food", description: "맛집 게시판" },
  { slug: "cafe", name: "카페", categorySlug: "food", description: "카페 게시판" },

  // ---- Music ----
  { slug: "kpop", name: "K-POP", categorySlug: "music", description: "K-POP 게시판" },
  { slug: "hiphop", name: "힙합", categorySlug: "music", description: "힙합 게시판" },
  { slug: "rock", name: "록/메탈", categorySlug: "music", description: "록/메탈 게시판" },
  { slug: "indie", name: "인디음악", categorySlug: "music", description: "인디음악 게시판" },

  // ---- Fashion ----
  { slug: "fashion-men", name: "남자패션", categorySlug: "fashion", description: "남자패션 게시판" },
  { slug: "fashion-women", name: "여자패션", categorySlug: "fashion", description: "여자패션 게시판" },
  { slug: "sneakers", name: "스니커즈", categorySlug: "fashion", description: "스니커즈 게시판" },

  // ---- Movie/Drama ----
  { slug: "movie", name: "영화", categorySlug: "movie-drama", description: "영화 게시판" },
  { slug: "kdrama", name: "한국드라마", categorySlug: "movie-drama", description: "한국드라마 게시판" },
  { slug: "netflix", name: "넷플릭스", categorySlug: "movie-drama", description: "넷플릭스 게시판" },

  // ---- Humor ----
  { slug: "humor", name: "유머", categorySlug: "humor", description: "유머 게시판" },
  { slug: "meme", name: "밈", categorySlug: "humor", description: "밈 게시판" },

  // ---- Stock ----
  { slug: "stock", name: "주식", categorySlug: "stock", description: "주식 게시판" },
  { slug: "bitcoin", name: "비트코인", categorySlug: "stock", description: "비트코인 게시판" },
  { slug: "realestate", name: "부동산", categorySlug: "stock", description: "부동산 게시판" },

  // ---- Animal ----
  { slug: "dogcat", name: "강아지/고양이", categorySlug: "animal", description: "강아지/고양이 게시판" },
  { slug: "aquarium", name: "아쿠아리움", categorySlug: "animal", description: "아쿠아리움 게시판" },

  // ---- Car ----
  { slug: "domestic-car", name: "국산차", categorySlug: "car", description: "국산차 게시판" },
  { slug: "foreign-car", name: "수입차", categorySlug: "car", description: "수입차 게시판" },

  // ---- University ----
  { slug: "snu-gall", name: "서울대 게시판", categorySlug: "university", description: "서울대학교 게시판" },
  { slug: "yonsei-gall", name: "연세대 게시판", categorySlug: "university", description: "연세대학교 게시판" },
  { slug: "korea-gall", name: "고려대 게시판", categorySlug: "university", description: "고려대학교 게시판" },
];

// ==================== SEED FUNCTION ====================

async function main() {
  console.log("Seeding universities...");
  for (const uni of universities) {
    await prisma.university.upsert({
      where: { domain: uni.domain },
      update: {
        name: uni.name,
        shortName: uni.shortName,
        region: uni.region,
      },
      create: {
        name: uni.name,
        shortName: uni.shortName,
        domain: uni.domain,
        region: uni.region,
      },
    });
  }
  console.log(`  -> ${universities.length} universities upserted.`);

  console.log("Seeding gallery categories...");
  for (const cat of galleryCategories) {
    await prisma.galleryCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        order: cat.order,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        order: cat.order,
      },
    });
  }
  console.log(`  -> ${galleryCategories.length} gallery categories upserted.`);

  console.log("Seeding galleries...");
  // Build a slug -> id map for categories
  const categoryMap = new Map<string, string>();
  const allCategories = await prisma.galleryCategory.findMany();
  for (const cat of allCategories) {
    categoryMap.set(cat.slug, cat.id);
  }

  for (const gal of galleries) {
    const categoryId = categoryMap.get(gal.categorySlug);
    if (!categoryId) {
      console.warn(`  [WARN] Category not found for slug: ${gal.categorySlug}, skipping gallery: ${gal.slug}`);
      continue;
    }

    await prisma.gallery.upsert({
      where: { slug: gal.slug },
      update: {
        name: gal.name,
        description: gal.description,
        categoryId,
        type: "MAJOR",
      },
      create: {
        name: gal.name,
        slug: gal.slug,
        description: gal.description,
        categoryId,
        type: "MAJOR",
      },
    });
  }
  console.log(`  -> ${galleries.length} galleries upserted.`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
