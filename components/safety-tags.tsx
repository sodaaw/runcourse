import { Lightbulb, MoveHorizontal, Waves, TrendingUp } from "lucide-react";
import clsx from "clsx";
import { Course } from "@/lib/types";

const STREETLIGHT_LABEL: Record<Course["streetlightLevel"], string> = {
  bright: "가로등 밝음",
  moderate: "가로등 보통",
  dim: "가로등 약함",
};

export function SafetyTags({ course }: { course: Course }) {
  const brightStreetlight = course.streetlightLevel === "bright";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-mute">
      <span
        className={clsx(
          "flex items-center gap-1",
          brightStreetlight && "text-safety"
        )}
      >
        <Lightbulb size={14} strokeWidth={2} />
        {STREETLIGHT_LABEL[course.streetlightLevel]}
      </span>
      <span className="flex items-center gap-1">
        <MoveHorizontal size={14} strokeWidth={2} />
        인도 {course.sidewalkWidth === "wide" ? "넓음" : "좁음"}
      </span>
      <span className="flex items-center gap-1">
        {course.terrain === "hill" ? (
          <TrendingUp size={14} strokeWidth={2} />
        ) : (
          <Waves size={14} strokeWidth={2} />
        )}
        {course.terrain === "hill" ? "언덕" : "평지"}
      </span>
    </div>
  );
}
