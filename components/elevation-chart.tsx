"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ElevationPoint } from "@/lib/types";

export function ElevationChart({ data }: { data: ElevationPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="elevationFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D6B4C" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3D6B4C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E4E2DA" vertical={false} />
          <XAxis
            dataKey="distanceKm"
            tickFormatter={(v) => `${v}km`}
            tick={{ fontSize: 11, fill: "#6B6F68" }}
            axisLine={{ stroke: "#E4E2DA" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}m`}
            tick={{ fontSize: 11, fill: "#6B6F68" }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            formatter={(value) => [`${value}m`, "고도"]}
            labelFormatter={(label) => `${label}km 지점`}
            contentStyle={{
              border: "1px solid #E4E2DA",
              borderRadius: 8,
              fontSize: 13,
              backgroundColor: "#FBFAF7",
            }}
          />
          <Area
            type="monotone"
            dataKey="elevationM"
            stroke="#3D6B4C"
            strokeWidth={2}
            fill="url(#elevationFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
