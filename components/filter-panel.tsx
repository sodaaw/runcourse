"use client";

import clsx from "clsx";
import { FilterState } from "@/lib/types";

function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; variant?: "default" | "night" }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          const isNight = opt.variant === "night";
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={clsx(
                "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                active
                  ? isNight
                    ? "border-night bg-night text-white"
                    : "border-accent bg-accent text-white"
                  : "border-line bg-canvas text-ink hover:border-ink"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleChip({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      aria-pressed={active}
      className={clsx(
        "h-11 min-w-[44px] rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-canvas text-ink hover:border-ink"
      )}
    >
      {label}
    </button>
  );
}

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-ink">최대 거리</p>
          <p className="tabular-nums text-sm font-semibold text-accent">
            {filters.maxDistanceKm.toFixed(1)}km
          </p>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={0.5}
          value={filters.maxDistanceKm}
          onChange={(e) =>
            onChange({ ...filters, maxDistanceKm: Number(e.target.value) })
          }
          className="mt-3 h-11 w-full accent-[#3D6B4C]"
        />
      </div>

      <ChipGroup
        label="난이도"
        value={filters.difficulty}
        onChange={(v) => onChange({ ...filters, difficulty: v })}
        options={[
          { value: "any", label: "전체" },
          { value: "easy", label: "쉬움" },
          { value: "moderate", label: "보통" },
          { value: "hard", label: "어려움" },
        ]}
      />

      <ChipGroup
        label="지형"
        value={filters.terrain}
        onChange={(v) => onChange({ ...filters, terrain: v })}
        options={[
          { value: "any", label: "전체" },
          { value: "flat", label: "평지" },
          { value: "hill", label: "언덕" },
        ]}
      />

      <ChipGroup
        label="시간대"
        value={filters.timeOfDay}
        onChange={(v) => onChange({ ...filters, timeOfDay: v })}
        options={[
          { value: "any", label: "전체" },
          { value: "day", label: "주간" },
          { value: "night", label: "야간", variant: "night" },
        ]}
      />

      <div>
        <p className="text-sm font-semibold text-ink">안전 요소</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <ToggleChip
            label="가로등 밝음"
            active={filters.streetlightBright}
            onChange={(v) => onChange({ ...filters, streetlightBright: v })}
          />
          <ToggleChip
            label="인도 폭 넓음"
            active={filters.wideSidewalk}
            onChange={(v) => onChange({ ...filters, wideSidewalk: v })}
          />
        </div>
      </div>
    </div>
  );
}
