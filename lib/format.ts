import { Difficulty } from "./types";

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
