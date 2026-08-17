"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ElevationPoint } from "@/lib/types";

export function ElevationMiniChart({ data }: { data: ElevationPoint[] }) {
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="elevationMiniFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D6B4C" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#3D6B4C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="elevationM"
            stroke="#3D6B4C"
            strokeWidth={1.5}
            fill="url(#elevationMiniFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
