"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { ResponseStatus } from "@/lib/types";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

const CONFIRMED_COPY: Record<ResponseStatus, [string, string]> = {
  leaving: ["You said you're on the way", "Driver has been notified — hustle a little!"],
  arrived: ["You confirmed you're at the stop", "The driver can see you're ready. Bus is on its way."],
  delayed: ["You flagged a 1 minute delay", "Driver will wait one extra minute at your stop."],
  noshow: ["No response was recorded", "The driver moved on. You can still catch the next stop if nearby."],
};

export default function StudentView() {
  const { stopState, studentRespond, meStopId, meStudentId } = useStore();
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setClock(`${pad(now.getHours() % 12 || 12)}:${pad(now.getMinutes())}`);
    }
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const stData = stopState[meStopId];
  const myStatus = stData?.perStudent[meStudentId];

  return (
    <div className="view-enter">
      <div className="mb-7">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--ink-70)] flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" /> Student
        </div>
        <h1 className="font-display text-[30px] font-bold tracking-tight">Aarav Mehta — Grade 6B</h1>
        <p className="text-[var(--ink-70)] text-[14.5px] mt-1.5 max-w-[560px] leading-relaxed">
          Riding <b className="font-mono">GS-04</b>, boarding at <b>Lake View Colony</b>. When the bus is close,
          your phone buzzes — tell the driver whether to wait.
        </p>
      </div>

      <div className="max-w-[340px] mx-auto bg-[var(--ink)] rounded-[34px] p-3 shadow-[var(--shadow)]">
        <div className="bg-[var(--paper)] rounded-3xl min-h-[520px] relative overflow-hidden">
          <div className="flex justify-between px-5 pt-3.5 pb-1.5 font-mono text-[11px] text-[var(--ink-70)]">
            <span>{clock}</span>
            <span>●●●● Transit</span>
          </div>
          <div className="px-[18px] pt-4 pb-4">
            <div className="text-center font-display text-[44px] font-semibold mb-0.5">{clock}</div>
            <div className="text-center text-[12.5px] text-[var(--ink-70)] mb-[22px]">Wednesday, 26 August</div>

            {myStatus ? (
              <div className="bg-[var(--green-tint)] border border-[#BFE3D2] rounded-[14px] p-4 text-center notif-enter">
                <div className="font-display font-bold text-base text-[var(--green)] mb-0.5">
                  {CONFIRMED_COPY[myStatus][0]}
                </div>
                <div className="text-xs text-[var(--ink-70)]">{CONFIRMED_COPY[myStatus][1]}</div>
              </div>
            ) : stData?.status === "notified" ? (
              <>
                <div className="card p-4 mb-3.5 notif-enter">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-[22px] h-[22px] rounded-md bg-[var(--bus-yellow)] shrink-0" />
                    <div className="text-[11px] font-bold text-[var(--ink-70)] uppercase tracking-wide flex-1">
                      Transit
                    </div>
                    <div className="text-[10.5px] text-[var(--ink-70)] font-mono">now</div>
                  </div>
                  <div className="font-bold text-[14.5px] mb-1">Your bus is close 🚌</div>
                  <div className="text-[13px] text-[var(--ink-70)] leading-snug mb-3">
                    GS-04 is about 2 minutes from <b>Lake View Colony</b>. Let the driver know your status.
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => studentRespond("leaving")}
                      className="flex-1 rounded-[9px] py-2.5 px-1 text-xs font-bold bg-[var(--green)] text-white active:scale-95 transition-transform"
                    >
                      Leaving now
                    </button>
                    <button
                      onClick={() => studentRespond("arrived")}
                      className="flex-1 rounded-[9px] py-2.5 px-1 text-xs font-bold bg-[var(--ink)] text-[var(--bus-yellow)] active:scale-95 transition-transform"
                    >
                      Arrived
                    </button>
                    <button
                      onClick={() => studentRespond("delayed")}
                      className="flex-1 rounded-[9px] py-2.5 px-1 text-xs font-bold bg-[var(--amber)] text-white active:scale-95 transition-transform"
                    >
                      +1 min
                    </button>
                  </div>
                </div>
                <p className="text-center text-[11.5px] text-[var(--ink-70)]">
                  Alert {stData.notifCount} of 2 · auto re-alert in {stData.secondsLeft}s if no reply
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center px-8 py-16 text-[var(--ink-70)]">
                <div className="text-3xl mb-2.5">🚌</div>
                <p className="text-[13px] leading-relaxed">
                  No alerts yet.
                  <br />
                  You&apos;ll be notified when the bus is a few minutes from your stop.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
