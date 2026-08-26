"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { INITIAL_ROUTE, INITIAL_VANS, ME_STOP_ID, ME_STUDENT_ID } from "./data";
import { ResponseStatus, Stop, StopState, Van } from "./types";

function freshState(route: Stop[]): Record<string, StopState> {
  const s: Record<string, StopState> = {};
  route.forEach((stop) => {
    s[stop.id] = { status: "pending", notifCount: 0, secondsLeft: 0, perStudent: {} };
  });
  return s;
}

interface Ctx {
  route: Stop[];
  vans: Van[];
  setVans: React.Dispatch<React.SetStateAction<Van[]>>;
  stopState: Record<string, StopState>;
  busAtIndex: number;
  advanceBus: () => void;
  resendAlert: () => void;
  resetDemo: () => void;
  studentRespond: (action: ResponseStatus) => void;
  meStopId: string;
  meStudentId: string;
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Stop[]>(INITIAL_ROUTE);
  const [vans, setVans] = useState<Van[]>(INITIAL_VANS);
  const [stopState, setStopState] = useState<Record<string, StopState>>(() => freshState(INITIAL_ROUTE));
  const [busAtIndex, setBusAtIndex] = useState(-1);
  const intervals = useRef<Record<string, ReturnType<typeof setInterval> | null>>({});

  const clearTimer = useCallback((stopId: string) => {
    const t = intervals.current[stopId];
    if (t) {
      clearInterval(t);
      intervals.current[stopId] = null;
    }
  }, []);

  const recompute = useCallback(
    (stopId: string, s: StopState): StopState => {
      const stop = route.find((r) => r.id === stopId);
      if (!stop || !stop.students.length) return s;
      const allAnswered = stop.students.every((st) => s.perStudent[st.id]);
      if (allAnswered) {
        const anyDelay = stop.students.some((st) => s.perStudent[st.id] === "delayed");
        s.status = anyDelay ? "delayed" : "leaving";
      }
      return s;
    },
    [route]
  );

  const fireNotification = useCallback(
    (stopId: string) => {
      const stop = route.find((r) => r.id === stopId);
      if (!stop || !stop.students.length) return;

      setStopState((prev) => {
        const next = { ...prev };
        const cur = { ...next[stopId] };
        cur.status = "notified";
        cur.notifCount += 1;
        cur.secondsLeft = 60;
        next[stopId] = cur;
        return next;
      });

      clearTimer(stopId);
      intervals.current[stopId] = setInterval(() => {
        setStopState((prev) => {
          const cur = { ...prev[stopId] };
          cur.secondsLeft -= 1;

          if (cur.secondsLeft > 0) {
            return { ...prev, [stopId]: cur };
          }

          clearTimer(stopId);
          const unanswered = stop.students.filter((st) => !cur.perStudent[st.id]);

          if (unanswered.length && cur.notifCount < 2) {
            // resend on next tick, outside this updater
            setTimeout(() => fireNotification(stopId), 0);
            return { ...prev, [stopId]: cur };
          }

          if (unanswered.length) {
            unanswered.forEach((st) => {
              cur.perStudent[st.id] = "noshow";
            });
            cur.status = "noshow";
          }
          return { ...prev, [stopId]: cur };
        });
      }, 1000);
    },
    [route, clearTimer]
  );

  const advanceBus = useCallback(() => {
    setBusAtIndex((prevIndex) => {
      if (prevIndex >= route.length - 1) return prevIndex;
      if (prevIndex >= 0) clearTimer(route[prevIndex].id);
      const nextIndex = prevIndex + 1;
      const stop = route[nextIndex];
      if (stop.students.length) {
        fireNotification(stop.id);
      } else {
        setStopState((prev) => ({ ...prev, [stop.id]: { ...prev[stop.id], status: "arrived" } }));
      }
      return nextIndex;
    });
  }, [route, fireNotification, clearTimer]);

  const resendAlert = useCallback(() => {
    if (busAtIndex < 0) return;
    const stop = route[busAtIndex];
    const cur = stopState[stop.id];
    if (stop.students.length && cur.notifCount < 2) {
      fireNotification(stop.id);
    }
  }, [busAtIndex, route, stopState, fireNotification]);

  const studentRespond = useCallback(
    (action: ResponseStatus) => {
      clearTimer(ME_STOP_ID);
      setStopState((prev) => {
        const cur = { ...prev[ME_STOP_ID], perStudent: { ...prev[ME_STOP_ID].perStudent } };
        cur.perStudent[ME_STUDENT_ID] = action;
        const updated = recompute(ME_STOP_ID, cur);
        return { ...prev, [ME_STOP_ID]: updated };
      });
    },
    [clearTimer, recompute]
  );

  const resetDemo = useCallback(() => {
    route.forEach((s) => clearTimer(s.id));
    setStopState(freshState(route));
    setBusAtIndex(-1);
  }, [route, clearTimer]);

  useEffect(() => {
    return () => {
      Object.keys(intervals.current).forEach((id) => clearTimer(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StoreContext.Provider
      value={{
        route,
        vans,
        setVans,
        stopState,
        busAtIndex,
        advanceBus,
        resendAlert,
        resetDemo,
        studentRespond,
        meStopId: ME_STOP_ID,
        meStudentId: ME_STUDENT_ID,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
