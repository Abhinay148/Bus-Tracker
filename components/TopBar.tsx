"use client";

export type Role = "admin" | "student" | "driver" | "parent";

const ROLES: { key: Role; label: string }[] = [
  { key: "admin", label: "School" },
  { key: "student", label: "Student" },
  { key: "driver", label: "Driver" },
  { key: "parent", label: "Parent" },
];

export default function TopBar({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div className="flex items-center justify-between px-7 py-[18px] border-b border-[var(--line)] bg-[var(--paper-raised)] sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-[var(--ink)] flex items-center justify-center relative shrink-0">
          <div className="w-4 h-[3px] rounded bg-[var(--bus-yellow)] shadow-[0_5px_0_var(--bus-yellow),0_-5px_0_rgba(255,255,255,0.25)]" />
        </div>
        <div>
          <div className="font-display font-bold text-[18px] tracking-tight leading-none">Transit</div>
          <div className="text-[11px] text-[var(--ink-70)] uppercase tracking-wider mt-[2px]">
            School bus, confirmed
          </div>
        </div>
      </div>
      <div className="flex gap-1 bg-[var(--grey-tint)] p-1 rounded-[11px]">
        {ROLES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRole(r.key)}
            className={`px-4 py-2 rounded-lg font-semibold text-[13px] transition-all ${
              role === r.key
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "text-[var(--ink-70)] hover:text-[var(--ink)]"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
