import Link from "next/link";
import { Course } from "@/lib/types";
import { DIFFICULTY_CLASS, DIFFICULTY_LABEL } from "@/lib/format";
import { ElevationMiniChart } from "./elevation-mini-chart";
import { SafetyTags } from "./safety-tags";
import { SaveButton } from "./save-button";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block border border-line bg-canvas p-5 transition-colors hover:border-ink"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-mute">{course.neighborhood}</p>
          <h3 className="mt-0.5 truncate text-[17px] font-bold text-ink">{course.name}</h3>
        </div>
        <SaveButton courseId={course.id} size="sm" />
      </div>

      <div className="mt-3 flex items-baseline gap-4 tabular-nums">
        <span className="text-2xl font-extrabold text-ink">
          {course.distanceKm}
          <span className="ml-0.5 text-sm font-medium text-mute">km</span>
        </span>
        <span className="text-sm text-mute">약 {course.estimatedMinutes}분</span>
        <span
          className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_CLASS[course.difficulty]}`}
        >
          {DIFFICULTY_LABEL[course.difficulty]}
        </span>
      </div>

      <div className="mt-3 -mx-1">
        <ElevationMiniChart data={course.elevation} />
      </div>

      <div className="mt-2 border-t border-line pt-3">
        <SafetyTags course={course} />
      </div>
    </Link>
  );
}
