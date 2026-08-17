import Link from "next/link";
import { Star } from "lucide-react";
import { Course } from "@/lib/types";
import { DIFFICULTY_LABEL } from "@/lib/format";
import { SaveButton } from "./save-button";

export function CourseCard({ course }: { course: Course }) {
  const isNight = course.timeOfDay.includes("night");

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex gap-4 border-b border-line py-5 first:pt-0 last:border-b-0"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-canvas-alt">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.imageUrl}
          alt={course.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-mute">{course.neighborhood}</p>

        <div className="flex items-start justify-between gap-3">
          <h3 className="mt-0.5 truncate text-[15px] font-semibold text-ink">
            {course.name}
          </h3>
          <SaveButton courseId={course.id} size="sm" variant="ghost" />
        </div>

        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-mute">
          <span className="inline-flex items-center gap-0.5 font-medium text-ink">
            <Star size={11} fill="#3D6B4C" className="text-accent" />
            {course.recommendScore}%
          </span>
          <span>·</span>
          <span>{DIFFICULTY_LABEL[course.difficulty]}</span>
          <span>·</span>
          <span>{course.distanceKm}km</span>
          {isNight && (
            <>
              <span>·</span>
              <span>야간 가능</span>
            </>
          )}
        </p>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-mute">
          {course.description}
        </p>
      </div>
    </Link>
  );
}
