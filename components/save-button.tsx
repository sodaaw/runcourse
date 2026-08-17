"use client";

import { Bookmark } from "lucide-react";
import clsx from "clsx";
import { useAppState } from "@/lib/app-state";

export function SaveButton({
  courseId,
  size = "md",
}: {
  courseId: string;
  size?: "sm" | "md";
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
      }}
      aria-pressed={saved}
      aria-label={saved ? "저장 취소" : "코스 저장"}
      className={clsx(
        "flex items-center justify-center rounded-full border transition-colors",
        size === "md" ? "h-11 w-11" : "h-9 w-9",
        saved
          ? "border-accent bg-accent text-white"
          : "border-line bg-canvas text-ink hover:border-ink"
      )}
    >
      <Bookmark size={18} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
