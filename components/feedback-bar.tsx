"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import clsx from "clsx";
import { useAppState } from "@/lib/app-state";
import { trackEvent } from "@/lib/gtag";
import { SaveButton } from "./save-button";

export function FeedbackBar({
  courseId,
  courseName,
}: {
  courseId: string;
  courseName?: string;
}) {
  const { feedback, setFeedback } = useAppState();
  const current = feedback[courseId] ?? null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-canvas px-6 py-3 sm:bottom-0">
      <div className="mx-auto flex max-w-content items-center gap-3">
        <p className="hidden text-sm font-medium text-ink sm:block">
          이 코스 유용했나요?
        </p>
        <p className="text-sm font-medium text-ink sm:hidden">유용했나요?</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = current === "up" ? null : "up";
              setFeedback(courseId, next);
              trackEvent(next === "up" ? "like_course" : "clear_feedback", {
                course_id: courseId,
                course_name: courseName,
              });
            }}
            aria-pressed={current === "up"}
            className={clsx(
              "flex h-11 items-center gap-1.5 rounded-lg border px-4 text-sm font-semibold transition-colors",
              current === "up"
                ? "border-accent bg-accent-soft text-accent"
                : "border-line text-ink hover:border-ink"
            )}
          >
            <ThumbsUp size={16} strokeWidth={2} fill={current === "up" ? "currentColor" : "none"} />
            추천
          </button>
          <button
            type="button"
            onClick={() => {
              const next = current === "down" ? null : "down";
              setFeedback(courseId, next);
              trackEvent(next === "down" ? "dislike_course" : "clear_feedback", {
                course_id: courseId,
                course_name: courseName,
              });
            }}
            aria-pressed={current === "down"}
            className={clsx(
              "flex h-11 items-center gap-1.5 rounded-lg border px-4 text-sm font-semibold transition-colors",
              current === "down"
                ? "border-caution bg-caution/10 text-caution"
                : "border-line text-ink hover:border-ink"
            )}
          >
            <ThumbsDown size={16} strokeWidth={2} fill={current === "down" ? "currentColor" : "none"} />
            비추천
          </button>
        </div>
        <div className="ml-auto">
          <SaveButton courseId={courseId} courseName={courseName} size="sm" />
        </div>
      </div>
    </div>
  );
}
