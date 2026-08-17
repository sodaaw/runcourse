"use client";

import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";
import { courses } from "@/lib/mock-data";
import { useAppState } from "@/lib/app-state";
import { CourseCard } from "@/components/course-card";

export default function SavedPage() {
  const { savedIds, metrics } = useAppState();
  const savedCourses = courses.filter((c) => savedIds.includes(c.id));

  return (
    <div className="mx-auto max-w-content px-6 py-8">
      <h1 className="text-2xl font-semibold text-ink">저장한 코스</h1>
      <p className="mt-1 text-sm text-mute">
        북마크한 코스 {savedCourses.length}개
      </p>

      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:max-w-sm">
        <div className="bg-canvas px-4 py-3">
          <p className="text-xs text-mute">저장 버튼 클릭 수</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
            {metrics.saveClicks}
          </p>
        </div>
        <div className="bg-canvas px-4 py-3">
          <p className="text-xs text-mute">추천/비추천 응답 수</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
            {metrics.feedbackClicks}
          </p>
        </div>
      </div>

      {savedCourses.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-line px-6 py-20 text-center">
          <Bookmark size={28} strokeWidth={1.75} className="text-mute" />
          <p className="mt-4 text-sm font-medium text-ink">
            아직 저장한 코스가 없어요.
          </p>
          <p className="mt-1 text-sm text-mute">
            마음에 드는 코스를 저장하고 빠르게 다시 찾아보세요.
          </p>
          <Link
            href="/courses"
            className="mt-6 flex h-12 items-center gap-1.5 rounded-xl bg-ink px-5 text-sm font-bold text-white"
          >
            코스 둘러보기
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          {savedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
