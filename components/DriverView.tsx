"use client";

import { useStore } from "@/lib/store";
import RouteStrip from "./RouteStrip";
import { StopStatus } from "@/lib/types";

const STATUS_PILL: Record<StopStatus, [string, string]> = {
  pending: ["pill-grey", "Not yet asked"],
  notified: ["pill-yellow", "Waiting on reply"],
  leaving: ["pill-green", "On the way"],
  arrived: ["pill-green", "At the stop"],
  delayed: ["pill-amber", "+1 min delay"],
  noshow: ["pill-red", "No response"],
};

export default function DriverView() {
  const { route, stopState } = useStore();
  const stopsWithStudents = route.filter((s) => s.students.length);

  return (
    <div className="view-enter">
      <div className="mb-7">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--ink-70)] flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" /> Driver — Ramesh Kumar
        </div>
        <h1 className="font-display text-[30px] font-bold tracking-tight">Route GS-04 · Morning pickup</h1>
        <p className="text-[var(--ink-70)] text-[14.5px] mt-1.5 max-w-[560px] leading-relaxed">
          You don&apos;t have to guess who&apos;s coming. Each stop shows live confirmations from students —
          wait, go, or resend the alert.
        </p>
      </div>

      <div className="card p-[22px]">
        <RouteStrip />
      </div>

      <div className="mt-[22px]">
        <div className="font-display font-semibold text-base mb-3.5">Stop-by-stop status</div>
        {stopsWithStudents.map((stop) => {
          const stData = stopState[stop.id];
          const confirmedCount = stop.students.filter((st) =>
            ["leaving", "arrived", "delayed"].includes(stData.perStudent[st.id] || "")
          ).length;
          const [pillClass, pillLabel] = STATUS_PILL[stData.status];

          return (
            <div key={stop.id} className="border border-[var(--line)] rounded-xl px-[18px] py-4 mb-3 bg-[var(--paper-raised)]">
              <div className="flex items-center justify-between mb-3">
                <div className="font-display font-semibold text-[15.5px] flex items-center gap-2">
                  {stop.name}{" "}
                  <span className="font-mono text-[var(--ink-70)] text-[11.5px] font-normal">
                    · {confirmedCount}/{stop.students.length} confirmed
                  </span>
                </div>
                <span className={`pill ${pillClass}`}>{pillLabel}</span>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                {stop.students.map((st) => {
                  const pStat = stData.perStudent[st.id] || "pending";
                  const dotColor =
                    pStat === "pending"
                      ? "var(--line-strong)"
                      : pStat === "delayed"
                      ? "var(--amber)"
                      : pStat === "noshow"
                      ? "var(--red)"
                      : "var(--green)";
                  const label = pStat === "pending" ? "awaiting" : pStat === "delayed" ? "+1 min" : pStat === "noshow" ? "no reply" : pStat;
                  return (
                    <div key={st.id} className="flex items-center gap-2 bg-[var(--paper)] border border-[var(--line)] rounded-full py-[5px] pl-[5px] pr-3">
                      <div
                        className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold text-white font-display shrink-0 border-2 border-[var(--paper-raised)]"
                        style={{ background: st.color, boxShadow: `0 0 0 2px ${dotColor}` }}
                      >
                        {st.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-[12.5px] font-semibold leading-tight">{st.name}</div>
                        <div className="text-[10.5px] text-[var(--ink-70)] font-mono leading-tight">{label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
