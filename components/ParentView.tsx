"use client";

import { useStore } from "@/lib/store";
import { ResponseStatus } from "@/lib/types";

const STATUS_COPY: Record<ResponseStatus, string> = {
  leaving: "Aarav confirmed he's on the way to the stop.",
  arrived: "Aarav confirmed he's already at the stop, waiting.",
  delayed: "Aarav asked the driver to wait 1 extra minute.",
  noshow: "Aarav didn't respond in time — the driver moved on without waiting.",
};

export default function ParentView() {
  const { route, stopState, busAtIndex, meStopId, meStudentId } = useStore();

  const n = route.length;
  const pts = route.map((_, i) => ({
    x: 50 + i * (620 / (n - 1)),
    y: 110 + Math.sin(i * 1.1) * 30,
  }));
  const pathD = pts.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");

  const busPos = busAtIndex >= 0 ? pts[busAtIndex] : pts[0];
  const meIndex = route.findIndex((s) => s.id === meStopId);
  const stepsAway = meIndex - busAtIndex;
  const etaMin = busAtIndex < 0 ? null : Math.max(stepsAway * 3, 0);

  const stData = stopState[meStopId];
  const myStatus = stData?.perStudent[meStudentId];

  let pillClass = "pill-grey";
  let pillLabel = "● Not started";
  if (busAtIndex >= 0) {
    if (stepsAway <= 0) {
      pillClass = "pill-green";
      pillLabel = "● At stop";
    } else {
      pillClass = "pill-yellow";
      pillLabel = "● En route";
    }
  }

  return (
    <div className="view-enter">
      <div className="mb-7">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--ink-70)] flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" /> Parent
        </div>
        <h1 className="font-display text-[30px] font-bold tracking-tight">Where&apos;s Aarav&apos;s bus?</h1>
        <p className="text-[var(--ink-70)] text-[14.5px] mt-1.5 max-w-[560px] leading-relaxed">
          Live position of van <b className="font-mono">GS-04</b>, plus Aarav&apos;s own confirmation for today.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--ink-70)] font-semibold mb-0.5">
              ETA to Lake View Colony
            </div>
            <div className="font-display text-[28px] font-bold">
              {busAtIndex < 0 ? "Not started" : stepsAway <= 0 ? "Arrived" : `${etaMin} min`}
            </div>
          </div>
          <span className={`pill ${pillClass}`}>{pillLabel}</span>
        </div>
        <div className="bg-[#EFF1EA]">
          <svg viewBox="0 0 720 220" className="w-full block">
            <path d={pathD} fill="none" stroke="#C9CCC3" strokeWidth={4} strokeDasharray="1,10" strokeLinecap="round" />
            {pts.map((p, i) => {
              const done = i < busAtIndex;
              const isMe = route[i].id === meStopId;
              return (
                <g key={route[i].id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isMe ? 9 : 6}
                    fill={done ? "#2E9E6D" : "#fff"}
                    stroke={isMe ? "#8A5CF6" : "#B9BBAE"}
                    strokeWidth={isMe ? 3 : 2}
                  />
                  <text x={p.x} y={p.y + 24} fontSize={10} fontFamily="monospace" fill="#4A5471" textAnchor="middle">
                    {route[i].name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
            <g transform={`translate(${busPos.x},${busPos.y})`}>
              <circle r={14} fill="#FFC629" stroke="#16203A" strokeWidth={2} />
              <text x={0} y={5} fontSize={13} textAnchor="middle">
                🚌
              </text>
            </g>
          </svg>
        </div>
      </div>

      <div className="card p-[22px] mt-[18px]">
        <div className="font-display font-semibold text-base mb-2">Aarav&apos;s status today</div>
        <div className="text-[13.5px] text-[var(--ink-70)]">
          {myStatus
            ? STATUS_COPY[myStatus]
            : stData?.status === "notified"
            ? "Aarav has been alerted and hasn't replied yet."
            : "Waiting for the bus to get closer — Aarav hasn't been asked yet."}
        </div>
      </div>
    </div>
  );
}
