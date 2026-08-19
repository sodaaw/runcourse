"use client";

import { Course } from "@/lib/types";
import { useAppState } from "@/lib/app-state";
import { CourseCard } from "@/components/course-card";

export function RecentlyViewedSection({ courses }: { courses: Course[] }) {
  const { recentlyViewedIds } = useAppState();

  const recentCourses = recentlyViewedIds
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is Course => Boolean(c));

  if (recentCourses.length === 0) return null;

  return (
    <section className="mx-auto max-w-content border-t border-line px-6 py-12 sm:py-16">
      <h2 className="text-xl font-semibold text-ink">최근 본 코스</h2>
      <p className="mt-1 text-sm text-mute">최근에 확인한 코스를 다시 볼 수 있어요.</p>
      <div className="mt-4">
        {recentCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
