"use client";

import { useStore } from "@/lib/store";

export default function RouteStrip() {
  const { route, busAtIndex } = useStore();
  const pct = busAtIndex <= 0 ? 0 : (busAtIndex / (route.length - 1)) * 100;

  return (
    <div className="overflow-x-auto px-1.5 pt-[34px] pb-3.5">
      <div className="relative flex items-start min-w-[640px]">
        <div className="absolute top-[15px] left-6 right-6 h-[3px] bg-[var(--line-strong)] rounded-full z-0" />
        <div
          className="absolute top-[15px] left-6 h-[3px] bg-[var(--green)] rounded-full z-[1] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        {route.map((stop, i) => {
          const done = i < busAtIndex;
          const current = i === busAtIndex;
          return (
            <div key={stop.id} className="flex-1 relative z-[2] text-center px-1">
              <div
                className={`w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center font-mono text-[11px] font-semibold relative border-[3px] transition-all
                ${
                  done
                    ? "border-[var(--green)] bg-[var(--green)] text-white"
                    : current
                    ? "border-[var(--bus-yellow-deep)] bg-[var(--bus-yellow)] text-[var(--ink)] node-pulse"
                    : "border-[var(--line-strong)] bg-[var(--paper-raised)] text-[var(--ink-70)]"
                }`}
              >
                {done ? "✓" : current ? <span className="text-sm">🚌</span> : i + 1}
              </div>
              <div className="text-[12.5px] font-semibold mb-[3px]">{stop.name}</div>
              <div className="text-[11px] text-[var(--ink-70)] font-mono">
                {stop.students.length ? `${stop.students.length} student${stop.students.length > 1 ? "s" : ""}` : "End of route"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
