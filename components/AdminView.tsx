"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function AdminView() {
  const { vans, setVans, route } = useStore();
  const [editingIndex, setEditingIndex] = useState(0);
  const [newVanId, setNewVanId] = useState("");
  const [newStopName, setNewStopName] = useState("");

  const totalStops = vans.reduce((a, v) => a + v.stops.length, 0);
  const totalStudents = route.reduce((a, s) => a + s.students.length, 0);
  const editingVan = vans[editingIndex];

  function addVan() {
    if (!newVanId.trim()) return;
    setVans((prev) => [...prev, { id: newVanId.trim(), stops: [] }]);
    setEditingIndex(vans.length);
    setNewVanId("");
  }

  function addStop() {
    if (!newStopName.trim()) return;
    setVans((prev) =>
      prev.map((v, i) => (i === editingIndex ? { ...v, stops: [...v.stops, newStopName.trim()] } : v))
    );
    setNewStopName("");
  }

  function removeStop(idx: number) {
    setVans((prev) => prev.map((v, i) => (i === editingIndex ? { ...v, stops: v.stops.filter((_, si) => si !== idx) } : v)));
  }

  return (
    <div className="view-enter">
      <div className="mb-7">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--ink-70)] flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" /> School setup
        </div>
        <h1 className="font-display text-[30px] font-bold tracking-tight">Register your school &amp; buses</h1>
        <p className="text-[var(--ink-70)] text-[14.5px] mt-1.5 max-w-[560px] leading-relaxed">
          Add your school once, then list every van with its route stops in order. Students join a van directly
          — no separate approval queue needed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-5">
        <div className="card p-[22px]">
          <div className="font-display font-semibold text-base mb-3.5">Buses on this account</div>
          <div>
            {vans.map((v, i) => (
              <div key={v.id} className="flex items-center justify-between py-3 border-b border-[var(--line)] last:border-none">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-semibold bg-[var(--ink)] text-[var(--bus-yellow)] px-2.5 py-1 rounded-md text-[12.5px] tracking-wide">
                    {v.id}
                  </span>
                  <span className="text-[var(--ink-70)] text-[12.5px]">{v.stops.length} stops</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingIndex(i)}>
                  Edit route
                </button>
              </div>
            ))}
          </div>
          <div className="h-px bg-[var(--line)] my-5" />
          <label className="text-xs font-semibold text-[var(--ink-70)] uppercase tracking-wide block mb-1.5">
            Add a new van
          </label>
          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="Van number, e.g. GS-07"
              value={newVanId}
              onChange={(e) => setNewVanId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addVan()}
            />
            <button className="btn btn-primary" onClick={addVan}>
              Add van
            </button>
          </div>
        </div>

        <div className="card p-[22px]">
          <div className="font-display font-semibold text-base mb-3.5">Greenwood Public School</div>
          <div className="kv">
            <span>Registered vans</span>
            <span>{vans.length}</span>
          </div>
          <div className="kv">
            <span>Total stops mapped</span>
            <span>{totalStops}</span>
          </div>
          <div className="kv">
            <span>Students joined</span>
            <span>{totalStudents}</span>
          </div>
          <div className="h-px bg-[var(--line)] my-5" />
          <p className="text-[var(--ink-70)] text-[13.5px] leading-relaxed">
            Every stop below belongs to a van&apos;s route, in the order the bus reaches them. Students pick
            their van, then their nearest stop on that route.
          </p>
        </div>
      </div>

      <div className="h-px bg-[var(--line)] my-5" />

      <div className="card p-[22px]">
        <div className="font-display font-semibold text-base mb-3.5">
          Route editor — <span className="font-mono font-normal">{editingVan?.id}</span>
        </div>
        <div className="mb-1">
          {editingVan?.stops.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-[var(--grey-tint)] px-2.5 py-1.5 rounded-full text-[12.5px] mr-1.5 mb-1.5"
            >
              <span className="font-mono text-[10.5px] text-[var(--ink-70)]">{idx + 1}</span> {s}
              <button onClick={() => removeStop(idx)} className="text-[var(--ink-70)] text-[13px] leading-none">
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2.5 mt-2">
          <input
            type="text"
            placeholder="Stop name, e.g. Lake View Colony"
            value={newStopName}
            onChange={(e) => setNewStopName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStop()}
          />
          <button className="btn btn-ghost whitespace-nowrap" onClick={addStop}>
            + Add stop to route
          </button>
        </div>
      </div>
    </div>
  );
}
