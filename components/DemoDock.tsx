"use client";

import { useStore } from "@/lib/store";

export default function DemoDock() {
  const { route, busAtIndex, advanceBus, resendAlert, resetDemo, stopState } = useStore();

  const routeComplete = busAtIndex >= route.length - 1;
  const currentStop = busAtIndex >= 0 ? route[busAtIndex] : null;
  const resendDisabled = !currentStop || !currentStop.students.length || stopState[currentStop.id].notifCount >= 2;

  return (
    <div className="fixed bottom-[18px] left-1/2 -translate-x-1/2 z-50 bg-[var(--ink)] text-[var(--paper)] rounded-full py-2 pl-4 pr-2 flex items-center gap-3 shadow-[0_12px_32px_rgba(22,32,58,0.35)]">
      <span className="font-mono text-[11px] text-[var(--bus-yellow)] uppercase tracking-wide">Demo</span>
      <button
        onClick={advanceBus}
        disabled={routeComplete}
        className="border-none bg-white/10 hover:bg-white/[0.18] text-[var(--paper)] px-3.5 py-2 rounded-full font-semibold text-[12.5px] cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
      >
        {routeComplete ? "🏁 Route complete" : "▶ Advance bus to next stop"}
      </button>
      <button
        onClick={resendAlert}
        disabled={resendDisabled}
        className="border-none bg-white/10 hover:bg-white/[0.18] text-[var(--paper)] px-3.5 py-2 rounded-full font-semibold text-[12.5px] cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
      >
        ↻ Resend alert
      </button>
      <button
        onClick={resetDemo}
        className="border-none bg-[var(--bus-yellow)] hover:bg-[var(--bus-yellow-deep)] text-[var(--ink)] px-3.5 py-2 rounded-full font-semibold text-[12.5px] cursor-pointer"
      >
        Reset
      </button>
    </div>
  );
}
