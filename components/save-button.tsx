"use client";

import { Bookmark } from "lucide-react";
import clsx from "clsx";
import { useAppState } from "@/lib/app-state";
import { trackEvent } from "@/lib/gtag";

export function SaveButton({
  courseId,
  size = "md",
  variant = "solid",
}: {
  courseId: string;
  size?: "sm" | "md";
  variant?: "solid" | "ghost";
}) {
  const { isSaved, toggleSaved } = useAppState();
  const saved = isSaved(courseId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(courseId);
        trackEvent(saved ? "unsave_course" : "save_course", {
          course_id: courseId,
        });
      }}
      aria-pressed={saved}
      aria-label={saved ? "저장 취소" : "코스 저장"}
      className={clsx(
        "flex shrink-0 items-center justify-center transition-colors",
        size === "md" ? "h-11 w-11" : "h-9 w-9",
        variant === "solid" &&
          clsx(
            "rounded-full border",
            saved
              ? "border-accent bg-accent text-white"
              : "border-line bg-canvas text-ink hover:border-ink"
          ),
        variant === "ghost" && (saved ? "text-accent" : "text-mute hover:text-ink")
      )}
    >
      <Bookmark size={18} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
