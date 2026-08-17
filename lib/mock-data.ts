import { Course, ElevationPoint } from "./types";
import { generateRouteLoop, pointOnRoute } from "./geo";

function unsplash(id: string, w = 800, h = 600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

export const HERO_IMAGE = "/seoul.avif";

function genElevation(km: number, base: number, variance: number, seed: number): ElevationPoint[] {
  const points: ElevationPoint[] = [];
  const steps = Math.max(6, Math.round(km * 4));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const wave = Math.sin(t * Math.PI * (1 + (seed % 3)) + seed) * variance;
    const drift = Math.sin(seed) * variance * 0.3 * t;
    points.push({
      distanceKm: Number((t * km).toFixed(2)),
      elevationM: Math.round(base + wave + drift),
    });
  }
  return points;
}

const yeouidoRoute = generateRouteLoop({
  center: { lat: 37.5283, lng: 126.9328 },
  distanceKm: 3.2,
  seed: 1,
  bearingDeg: 100,
  aspectRatio: 0.3,
  maxMajorAxisKm: 0.3,
});

const seoulForestRoute = generateRouteLoop({
  center: { lat: 37.5443, lng: 127.0374 },
  distanceKm: 2.5,
  seed: 2,
  bearingDeg: 30,
  aspectRatio: 0.9,
});

const namsanRoute = generateRouteLoop({
  center: { lat: 37.5512, lng: 126.9882 },
  distanceKm: 5.4,
  seed: 3,
  bearingDeg: 45,
  aspectRatio: 0.75,
});

const banpoRoute = generateRouteLoop({
  center: { lat: 37.5117, lng: 126.9995 },
  distanceKm: 4.0,
  seed: 4,
  bearingDeg: 100,
  aspectRatio: 0.35,
  maxMajorAxisKm: 0.22,
});

const gyeonguiRoute = generateRouteLoop({
  center: { lat: 37.5599, lng: 126.9256 },
  distanceKm: 2.9,
  seed: 5,
  bearingDeg: 200,
  aspectRatio: 0.3,
  maxMajorAxisKm: 0.25,
});

const tancheonRoute = generateRouteLoop({
  center: { lat: 37.5013, lng: 127.0653 },
  distanceKm: 6.1,
  seed: 6,
  bearingDeg: 5,
  aspectRatio: 0.3,
  maxMajorAxisKm: 0.3,
});

const achasanRoute = generateRouteLoop({
  center: { lat: 37.5556, lng: 127.1027 },
  distanceKm: 4.7,
  seed: 7,
  bearingDeg: 60,
  aspectRatio: 0.5,
});

const olympicParkRoute = generateRouteLoop({
  center: { lat: 37.5183, lng: 127.122 },
  distanceKm: 3.8,
  seed: 8,
  bearingDeg: 15,
  aspectRatio: 0.85,
});

export const courses: Course[] = [
  {
    id: "hangang-yeouido",
    name: "여의도 한강공원 야경 코스",
    neighborhood: "영등포구 여의도동",
    distanceKm: 3.2,
    estimatedMinutes: 22,
    difficulty: "easy",
    terrain: "flat",
    timeOfDay: ["night", "day"],
    streetlightLevel: "bright",
    sidewalkWidth: "wide",
    surface: "우레탄 트랙 + 아스팔트",
    description:
      "한강 뷰를 따라 달리는 평지 코스. 가로등이 촘촘히 설치되어 있고 야간에도 인파가 많아 초보 러너의 첫 야간 러닝으로 적합합니다.",
    imageUrl: unsplash("1519331379826-f10be5486c6f"),
    center: { lat: 37.5283, lng: 126.9328 },
    route: yeouidoRoute,
    elevation: genElevation(3.2, 12, 1.5, 1),
    amenities: [
      { type: "toilet", label: "여의나루역 인근 화장실", position: pointOnRoute(yeouidoRoute, 0.1) },
      { type: "convenience-store", label: "CU 여의나루점", position: pointOnRoute(yeouidoRoute, 0.4) },
      { type: "water", label: "음수대 2곳", position: pointOnRoute(yeouidoRoute, 0.75) },
    ],
    reviews: [
      { id: "r1", author: "러너_민지", rating: 5, date: "2026-07-02", content: "밤에 뛰기 진짜 안전하고 뷰도 좋아요. 인도도 넓어서 유모차랑 부딪힐 일 없었어요." },
      { id: "r2", author: "초보조깅러", rating: 4, date: "2026-06-18", content: "평지라 처음 뛰기 딱 좋습니다. 주말엔 사람이 좀 많아요." },
    ],
    recommendScore: 96,
  },
  {
    id: "seoul-forest",
    name: "서울숲 둘레길 코스",
    neighborhood: "성동구 성수동",
    distanceKm: 2.5,
    estimatedMinutes: 16,
    difficulty: "easy",
    terrain: "flat",
    timeOfDay: ["day", "night"],
    streetlightLevel: "bright",
    sidewalkWidth: "wide",
    surface: "흙길 + 산책로",
    description:
      "숲 사이를 가로지르는 짧은 순환 코스. 완만한 흙길이라 무릎 부담이 적고, 저녁에도 조명이 밝아 안전합니다.",
    imageUrl: unsplash("1441974231531-c6227db76b6e"),
    center: { lat: 37.5443, lng: 127.0374 },
    route: seoulForestRoute,
    elevation: genElevation(2.5, 20, 2, 2),
    amenities: [
      { type: "toilet", label: "서울숲 정문 화장실", position: pointOnRoute(seoulForestRoute, 0.05) },
      { type: "convenience-store", label: "세븐일레븐 서울숲점", position: pointOnRoute(seoulForestRoute, 0.55) },
    ],
    reviews: [
      { id: "r3", author: "숲속러너", rating: 5, date: "2026-07-10", content: "흙길이라 발이 덜 아파요. 강아지 산책하는 분들도 많아서 사람 구경하며 뛰기 좋아요." },
    ],
    recommendScore: 91,
  },
  {
    id: "namsan-loop",
    name: "남산 순환로 언덕 코스",
    neighborhood: "중구 회현동",
    distanceKm: 5.4,
    estimatedMinutes: 38,
    difficulty: "hard",
    terrain: "hill",
    timeOfDay: ["day"],
    streetlightLevel: "moderate",
    sidewalkWidth: "wide",
    surface: "아스팔트 순환도로",
    description:
      "완만하지만 지속적인 오르막이 이어지는 체력 훈련용 코스. 차량 통제 구간이 많아 안전하지만 야간엔 조명이 약한 구간이 있습니다.",
    imageUrl: unsplash("1476820865390-c52aeebb9891"),
    center: { lat: 37.5512, lng: 126.9882 },
    route: namsanRoute,
    elevation: genElevation(5.4, 90, 18, 3),
    amenities: [
      { type: "toilet", label: "남산도서관 화장실", position: pointOnRoute(namsanRoute, 0.15) },
      { type: "water", label: "정상 음수대", position: pointOnRoute(namsanRoute, 0.6) },
    ],
    reviews: [
      { id: "r4", author: "언덕킬러", rating: 4, date: "2026-06-02", content: "오르막이 꽤 길어서 인터벌 훈련하기 좋아요. 야간엔 헤드램프 추천." },
      { id: "r5", author: "정상러너", rating: 5, date: "2026-05-20", content: "정상에서 보는 야경 보상이 확실합니다." },
    ],
    recommendScore: 84,
  },
  {
    id: "banpo-bridge",
    name: "반포 달빛무지개다리 코스",
    neighborhood: "서초구 반포동",
    distanceKm: 4.0,
    estimatedMinutes: 27,
    difficulty: "moderate",
    terrain: "flat",
    timeOfDay: ["night"],
    streetlightLevel: "bright",
    sidewalkWidth: "wide",
    surface: "우레탄 트랙",
    description:
      "분수쇼로 유명한 반포대교 남단을 따라 달리는 야간 특화 코스. 분수 조명 덕분에 체감 밝기가 매우 높습니다.",
    imageUrl: unsplash("1483721310020-03333e577078"),
    center: { lat: 37.5117, lng: 126.9995 },
    route: banpoRoute,
    elevation: genElevation(4.0, 14, 1, 4),
    amenities: [
      { type: "toilet", label: "세빛섬 화장실", position: pointOnRoute(banpoRoute, 0.05) },
      { type: "convenience-store", label: "GS25 반포한강공원점", position: pointOnRoute(banpoRoute, 0.45) },
      { type: "water", label: "음수대 3곳", position: pointOnRoute(banpoRoute, 0.7) },
    ],
    reviews: [
      { id: "r6", author: "달빛조깅", rating: 5, date: "2026-07-15", content: "분수쇼 시간대에 맞춰 뛰면 정말 예뻐요. 안전하고 사람도 많아요." },
    ],
    recommendScore: 93,
  },
  {
    id: "gyeongui-line",
    name: "경의선숲길 연남동 코스",
    neighborhood: "마포구 연남동",
    distanceKm: 2.9,
    estimatedMinutes: 19,
    difficulty: "easy",
    terrain: "flat",
    timeOfDay: ["day", "night"],
    streetlightLevel: "bright",
    sidewalkWidth: "narrow",
    surface: "산책로 + 보도블럭",
    description:
      "카페 거리를 가로지르는 도심형 코스. 인도 폭이 좁은 구간이 있어 사람이 몰리는 저녁 시간대엔 속도 조절이 필요합니다.",
    imageUrl: unsplash("1502472584811-0a2f2feb8968"),
    center: { lat: 37.5599, lng: 126.9256 },
    route: gyeonguiRoute,
    elevation: genElevation(2.9, 25, 1.2, 5),
    amenities: [
      { type: "convenience-store", label: "이마트24 연남점", position: pointOnRoute(gyeonguiRoute, 0.3) },
      { type: "toilet", label: "연남동 공영화장실", position: pointOnRoute(gyeonguiRoute, 0.65) },
    ],
    reviews: [
      { id: "r7", author: "동네조깅", rating: 3, date: "2026-06-25", content: "분위기는 최고인데 유동인구가 많아서 주말 저녁엔 피하는 게 좋아요." },
      { id: "r8", author: "연남주민", rating: 4, date: "2026-07-01", content: "평일 아침에 뛰면 한적하고 좋습니다." },
    ],
    recommendScore: 78,
  },
  {
    id: "tancheon",
    name: "탄천 야간 조명 코스",
    neighborhood: "강남구 대치동",
    distanceKm: 6.1,
    estimatedMinutes: 40,
    difficulty: "moderate",
    terrain: "flat",
    timeOfDay: ["night", "day"],
    streetlightLevel: "bright",
    sidewalkWidth: "wide",
    surface: "우레탄 트랙",
    description:
      "긴 직선 구간이 이어지는 장거리 훈련용 코스. LED 조명이 전 구간에 설치되어 있어 야간 안전도가 매우 높습니다.",
    imageUrl: unsplash("1502904550040-7534597429ae"),
    center: { lat: 37.5013, lng: 127.0653 },
    route: tancheonRoute,
    elevation: genElevation(6.1, 18, 1, 6),
    amenities: [
      { type: "toilet", label: "탄천종합운동장 화장실", position: pointOnRoute(tancheonRoute, 0.1) },
      { type: "water", label: "음수대 5곳", position: pointOnRoute(tancheonRoute, 0.5) },
      { type: "convenience-store", label: "CU 대치탄천점", position: pointOnRoute(tancheonRoute, 0.8) },
    ],
    reviews: [
      { id: "r9", author: "장거리러너", rating: 5, date: "2026-06-30", content: "10km 훈련하기에 최적. 조명 밝고 노면도 좋아요." },
    ],
    recommendScore: 89,
  },
  {
    id: "achasan",
    name: "아차산 둘레길 주간 코스",
    neighborhood: "광진구 워커힐로",
    distanceKm: 4.7,
    estimatedMinutes: 34,
    difficulty: "hard",
    terrain: "hill",
    timeOfDay: ["day"],
    streetlightLevel: "dim",
    sidewalkWidth: "narrow",
    surface: "산길 + 흙길",
    description:
      "기복이 심한 산길 코스로 트레일 러닝 입문에 적합합니다. 야간엔 조명이 없어 반드시 주간에만 이용하세요.",
    imageUrl: unsplash("1519834785169-98be25ec3f84"),
    center: { lat: 37.5556, lng: 127.1027 },
    route: achasanRoute,
    elevation: genElevation(4.7, 110, 25, 7),
    amenities: [
      { type: "toilet", label: "아차산 입구 화장실", position: pointOnRoute(achasanRoute, 0) },
    ],
    reviews: [
      { id: "r10", author: "트레일초보", rating: 4, date: "2026-05-28", content: "생각보다 힘들지만 정상 뷰가 좋아요. 야간엔 절대 비추입니다." },
    ],
    recommendScore: 72,
  },
  {
    id: "olympic-park",
    name: "올림픽공원 몽촌토성 코스",
    neighborhood: "송파구 방이동",
    distanceKm: 3.8,
    estimatedMinutes: 25,
    difficulty: "easy",
    terrain: "hill",
    timeOfDay: ["day", "night"],
    streetlightLevel: "bright",
    sidewalkWidth: "wide",
    surface: "우레탄 트랙 + 흙길",
    description:
      "완만한 언덕이 반복되는 순환 코스. 공원 내부라 차량이 없고 조명도 밝아 초보자가 언덕 훈련을 시작하기 좋습니다.",
    imageUrl: unsplash("1444492417251-9c84a5fa18e0"),
    center: { lat: 37.5183, lng: 127.122 },
    route: olympicParkRoute,
    elevation: genElevation(3.8, 30, 6, 8),
    amenities: [
      { type: "toilet", label: "평화의문 화장실", position: pointOnRoute(olympicParkRoute, 0.1) },
      { type: "convenience-store", label: "GS25 올림픽공원점", position: pointOnRoute(olympicParkRoute, 0.4) },
      { type: "water", label: "음수대 4곳", position: pointOnRoute(olympicParkRoute, 0.75) },
    ],
    reviews: [
      { id: "r11", author: "공원러너", rating: 5, date: "2026-07-08", content: "언덕이 짧게 반복돼서 부담 없이 훈련하기 좋아요." },
      { id: "r12", author: "저녁조깅", rating: 4, date: "2026-06-14", content: "저녁 7시쯤 가면 딱 좋은 인파에 조명도 밝습니다." },
    ],
    recommendScore: 88,
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
