"use client";

import { useState } from "react";
import { StoreProvider } from "@/lib/store";
import TopBar, { Role } from "@/components/TopBar";
import DemoDock from "@/components/DemoDock";
import AdminView from "@/components/AdminView";
import StudentView from "@/components/StudentView";
import DriverView from "@/components/DriverView";
import ParentView from "@/components/ParentView";

export default function Home() {
  const [role, setRole] = useState<Role>("admin");

  return (
    <StoreProvider>
      <TopBar role={role} setRole={setRole} />
      <div className="max-w-[1080px] mx-auto px-7 pt-9 pb-20">
        {role === "admin" && <AdminView />}
        {role === "student" && <StudentView />}
        {role === "driver" && <DriverView />}
        {role === "parent" && <ParentView />}
      </div>
      <DemoDock />
    </StoreProvider>
  );
}
