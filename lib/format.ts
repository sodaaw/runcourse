import { Course, Difficulty } from "./types";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "쉬움",
  moderate: "보통",
  hard: "어려움",
};

export const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  easy: "bg-accent-soft text-accent",
  moderate: "bg-surface text-ink",
  hard: "bg-caution/10 text-caution",
};

export function formatPace(minutes: number, km: number) {
  const paceMinPerKm = minutes / km;
  const min = Math.floor(paceMinPerKm);
  const sec = Math.round((paceMinPerKm - min) * 60);
  return `${min}'${sec.toString().padStart(2, "0")}"`;
}

const LIGHT_PHRASE: Record<Course["streetlightLevel"], string> = {
  bright: "가로등이 밝고",
  moderate: "가로등이 적당히 있고",
  dim: "가로등이 약한 구간이 있고",
};

const SIDEWALK_PHRASE: Record<Course["sidewalkWidth"], string> = {
  wide: "인도가 넓어 안전하고,",
  narrow: "인도가 좁은 구간이 있어 주의가 필요하고,",
};

const TERRAIN_PHRASE: Record<Course["terrain"], string> = {
  flat: "평지라 초보 러너도 뛰기 좋아요.",
  hill: "언덕이 있어 체력 훈련에 좋아요.",
};

export function getSafetySummary(course: Course): string {
  return `${LIGHT_PHRASE[course.streetlightLevel]} ${SIDEWALK_PHRASE[course.sidewalkWidth]} ${TERRAIN_PHRASE[course.terrain]}`;
}
