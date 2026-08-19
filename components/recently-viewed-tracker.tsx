"use client";

import { useEffect } from "react";
import { useAppState } from "@/lib/app-state";

export function RecentlyViewedTracker({ courseId }: { courseId: string }) {
  const { addRecentlyViewed } = useAppState();

  useEffect(() => {
    addRecentlyViewed(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  return null;
}
