import { ArrowRight } from "lucide-react";
import { courses, HERO_IMAGE } from "@/lib/mock-data";
import { CourseCard } from "@/components/course-card";
import { HeroSearchForm } from "@/components/hero-search-form";
import { TrackedLink } from "@/components/tracked-link";
import { RecentlyViewedSection } from "@/components/recently-viewed-section";

const NEIGHBORHOODS = [
  "영등포구 여의도동",
  "성동구 성수동",
  "마포구 연남동",
  "서초구 반포동",
  "강남구 대치동",
  "송파구 방이동",
];

const sortedByScore = [...courses].sort(
  (a, b) => b.recommendScore - a.recommendScore
);
const featuredCourse = sortedByScore[0];
const previewCourses = sortedByScore.slice(1, 4);

export default function Home() {
  return (
    <div>
      {/* Full-bleed photo hero */}
      <section className="relative flex min-h-[560px] items-end overflow-hidden sm:min-h-[640px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt="노을 지는 서울 야경, 남산타워가 보이는 도심 스카이라인"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />

        <div className="relative mx-auto w-full max-w-content px-6 pb-12 pt-32 sm:pb-16">
          <p className="text-sm font-medium text-white/80">
            초보 러너를 위한 안전 우선 코스 추천
          </p>
          <h1 className="mt-3 max-w-lg text-[36px] font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl">
            오늘 밤, 집 근처에서 안전하게 뛰세요
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/80">
            거리, 지형, 가로등과 인도 폭까지 — 원하는 조건만 고르면 검증된
            러닝 코스를 바로 추천해드려요.
          </p>

          <HeroSearchForm neighborhoods={NEIGHBORHOODS} />

          <TrackedLink
            href="/courses"
            event="nav_click"
            params={{ destination: "/courses", source: "home_hero_cta" }}
            className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-xl border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            코스 둘러보기
            <ArrowRight size={16} />
          </TrackedLink>
        </div>
      </section>

      {/* Featured course */}
      <section className="mx-auto max-w-content px-6 py-12 sm:py-16">
        <h2 className="text-xl font-semibold text-ink">오늘의 추천 코스</h2>
        <p className="mt-1 text-sm text-mute">
          안전 정보와 만족도가 가장 높은 코스예요.
        </p>
        <div className="mt-5">
          <CourseCard course={featuredCourse} />
        </div>
      </section>

      <RecentlyViewedSection courses={courses} />

      {/* Preview courses */}
      <section className="mx-auto max-w-content border-t border-line px-6 py-12 sm:py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">지금 인기있는 코스</h2>
            <p className="mt-1 text-sm text-mute">이번 주 러너들이 가장 많이 저장한 코스예요.</p>
          </div>
          <TrackedLink
            href="/courses"
            event="nav_click"
            params={{ destination: "/courses", source: "home_view_all_desktop" }}
            className="hidden items-center gap-1 text-sm font-medium text-accent hover:underline sm:flex"
          >
            전체보기
            <ArrowRight size={16} />
          </TrackedLink>
        </div>

        <div className="mt-4">
          {previewCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <TrackedLink
          href="/courses"
          event="nav_click"
          params={{ destination: "/courses", source: "home_view_all_mobile" }}
          className="mt-6 flex h-12 items-center justify-center gap-1 rounded-xl border border-line text-sm font-medium text-ink sm:hidden"
        >
          전체 코스 보기
          <ArrowRight size={16} />
        </TrackedLink>
      </section>
    </div>
  );
}
