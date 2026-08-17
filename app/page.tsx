import Link from "next/link";
import { ArrowRight, MapPin, Lightbulb, ShieldCheck } from "lucide-react";
import { courses } from "@/lib/mock-data";
import { CourseCard } from "@/components/course-card";

const NEIGHBORHOODS = [
  "영등포구 여의도동",
  "성동구 성수동",
  "마포구 연남동",
  "서초구 반포동",
  "강남구 대치동",
  "송파구 방이동",
];

const previewCourses = [...courses]
  .sort((a, b) => b.recommendScore - a.recommendScore)
  .slice(0, 3);

export default function Home() {
  return (
    <div>
      {/* Full-bleed asymmetric hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-6 py-16 sm:py-24 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-32">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white/70">
              <ShieldCheck size={16} strokeWidth={2.25} />
              초보 러너를 위한 안전 우선 코스 추천
            </p>
            <h1 className="mt-4 text-[40px] font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              오늘 밤,
              <br />
              집 근처에서
              <br />
              <span className="text-accent-soft">안전하게</span> 뛰세요.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
              거리, 지형, 가로등과 인도 폭까지 — 원하는 조건만 고르면
              검증된 러닝 코스를 바로 추천해드려요.
            </p>

            <form
              action="/courses"
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label className="flex h-14 flex-1 items-center gap-2.5 border border-white/20 bg-white/5 px-4 sm:max-w-xs">
                <MapPin size={18} className="shrink-0 text-white/60" />
                <select
                  name="location"
                  defaultValue={NEIGHBORHOODS[0]}
                  className="w-full bg-transparent text-sm font-medium text-white outline-none [&>option]:text-ink"
                >
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="flex h-14 items-center justify-center gap-2 bg-white px-6 text-sm font-bold text-ink transition-opacity hover:opacity-90"
              >
                내 코스 찾기
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="hidden border border-white/15 bg-white/5 p-6 lg:block">
            <p className="flex items-center gap-2 text-sm font-semibold text-safety">
              <Lightbulb size={16} />
              오늘의 야간 안전 코스
            </p>
            <p className="mt-3 text-2xl font-bold leading-snug">
              반포 달빛무지개다리 코스
            </p>
            <p className="mt-1 text-sm text-white/60">가로등 밝음 · 인도 넓음 · 4.0km</p>
            <div className="mt-6 flex items-end gap-6 tabular-nums">
              <div>
                <p className="text-3xl font-extrabold">96%</p>
                <p className="text-xs text-white/50">추천 만족도</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">27분</p>
                <p className="text-xs text-white/50">예상 소요시간</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview courses */}
      <section className="mx-auto max-w-content px-6 py-14 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">지금 인기있는 코스</h2>
            <p className="mt-1 text-sm text-mute">이번 주 러너들이 가장 많이 저장한 코스예요.</p>
          </div>
          <Link
            href="/courses"
            className="hidden items-center gap-1 text-sm font-semibold text-accent hover:underline sm:flex"
          >
            전체보기
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previewCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <Link
          href="/courses"
          className="mt-6 flex h-12 items-center justify-center gap-1 border border-line text-sm font-semibold text-ink sm:hidden"
        >
          전체 코스 보기
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
