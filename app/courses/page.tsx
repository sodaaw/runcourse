"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, LayoutList, Map as MapIcon } from "lucide-react";
import clsx from "clsx";
import { courses } from "@/lib/mock-data";
import { FilterState, SortOption } from "@/lib/types";
import { FilterPanel } from "@/components/filter-panel";
import { FilterSheet } from "@/components/filter-sheet";
import { CourseCard } from "@/components/course-card";
import { KakaoMap } from "@/components/kakao-map";

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 };

type View = "list" | "map";

const DEFAULT_FILTERS: FilterState = {
  maxDistanceKm: 10,
  difficulty: "any",
  terrain: "any",
  timeOfDay: "any",
  streetlightBright: false,
  wideSidewalk: false,
};

const DIFFICULTY_ORDER = { easy: 0, moderate: 1, hard: 2 };

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "추천순" },
  { value: "distance", label: "거리순" },
  { value: "difficulty", label: "난이도순" },
];

export default function CoursesPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [view, setView] = useState<View>("list");

  const results = useMemo(() => {
    const filtered = courses.filter((c) => {
      if (c.distanceKm > filters.maxDistanceKm) return false;
      if (filters.difficulty !== "any" && c.difficulty !== filters.difficulty)
        return false;
      if (filters.terrain !== "any" && c.terrain !== filters.terrain) return false;
      if (filters.timeOfDay !== "any" && !c.timeOfDay.includes(filters.timeOfDay))
        return false;
      if (filters.streetlightBright && c.streetlightLevel !== "bright") return false;
      if (filters.wideSidewalk && c.sidewalkWidth !== "wide") return false;
      return true;
    });

    const sorted = [...filtered];
    if (sort === "recommended") {
      sorted.sort((a, b) => b.recommendScore - a.recommendScore);
    } else if (sort === "distance") {
      sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      sorted.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
    }
    return sorted;
  }, [filters, sort]);

  const mapCenter = useMemo(() => {
    if (results.length === 0) return SEOUL_CENTER;
    return {
      lat: results.reduce((sum, c) => sum + c.center.lat, 0) / results.length,
      lng: results.reduce((sum, c) => sum + c.center.lng, 0) / results.length,
    };
  }, [results]);

  return (
    <div className="mx-auto max-w-content px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">AI 추천 코스</h1>
        <p className="mt-1 text-sm text-mute">
          조건에 맞는 코스 {results.length}개를 찾았어요.
        </p>
      </div>

      {/* Mobile filter bar */}
      <div className="mb-5 flex flex-col gap-3 sm:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex h-11 items-center gap-2 border border-line px-4 text-sm font-semibold text-ink"
          >
            <SlidersHorizontal size={16} />
            필터
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-11 flex-1 border border-line bg-canvas px-3 text-sm font-medium text-ink"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[220px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden sm:block">
          <div className="sticky top-20">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          <div className="mb-4 hidden items-center justify-end gap-4 sm:flex">
            <label className="flex items-center gap-2 text-sm text-mute">
              정렬
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-10 border border-line bg-canvas px-3 text-sm font-medium text-ink"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <ViewToggle view={view} onChange={setView} />
          </div>

          {results.length === 0 ? (
            <div className="border border-line py-20 text-center">
              <p className="text-sm font-medium text-mute">
                조건에 맞는 코스가 없어요. 필터를 조정해보세요.
              </p>
            </div>
          ) : view === "list" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {results.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div>
              <KakaoMap
                key={results.map((c) => c.id).join(",")}
                mode="markers"
                center={mapCenter}
                markers={results.map((c) => ({
                  id: c.id,
                  position: c.center,
                  label: `${c.name} · ${c.distanceKm}km`,
                }))}
                className="h-[420px] w-full border border-line sm:h-[560px]"
              />
              <p className="mt-2 text-xs text-mute">
                마커를 클릭하면 코스 상세 페이지로 이동해요.
              </p>
            </div>
          )}
        </div>
      </div>

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <FilterPanel filters={filters} onChange={setFilters} />
      </FilterSheet>
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <div className="flex h-11 border border-line">
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={view === "list"}
        className={clsx(
          "flex h-full items-center gap-1.5 px-3 text-sm font-medium transition-colors",
          view === "list" ? "bg-ink text-white" : "text-ink"
        )}
      >
        <LayoutList size={16} />
        목록
      </button>
      <button
        type="button"
        onClick={() => onChange("map")}
        aria-pressed={view === "map"}
        className={clsx(
          "flex h-full items-center gap-1.5 border-l border-line px-3 text-sm font-medium transition-colors",
          view === "map" ? "bg-ink text-white" : "text-ink"
        )}
      >
        <MapIcon size={16} />
        지도
      </button>
    </div>
  );
}
