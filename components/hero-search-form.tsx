"use client";

import { MapPin, Search } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

export function HeroSearchForm({ neighborhoods }: { neighborhoods: string[] }) {
  return (
    <form
      action="/courses"
      onSubmit={(e) => {
        const location = new FormData(e.currentTarget).get("location");
        trackEvent("search", { search_term: String(location ?? "") });
      }}
      className="mt-7 flex max-w-xl flex-col gap-2 rounded-2xl bg-canvas p-2 shadow-lg sm:flex-row sm:items-center"
    >
      <label className="flex h-12 flex-1 items-center gap-2.5 rounded-xl px-3">
        <MapPin size={18} className="shrink-0 text-mute" />
        <select
          name="location"
          defaultValue={neighborhoods[0]}
          className="w-full bg-transparent text-sm font-medium text-ink outline-none"
        >
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Search size={16} />
        코스 찾기
      </button>
    </form>
  );
}
