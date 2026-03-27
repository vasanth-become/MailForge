"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/layout/Sidebar";
import Header from "@/app/components/layout/Header";
import PreviewPanel from "@/app/components/preview/PreviewPanel";

export default function App() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // Server renders this static skeleton — zero store access, zero dynamic values.
  // Client renders the identical skeleton on first hydration, then useEffect fires
  // and isMounted flips true, rendering the real app. React sees matching output
  // on both passes → no hydration mismatch possible regardless of Zustand persist.
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
        <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="h-12 border-b border-slate-200 bg-white flex-shrink-0" />
          <div className="flex-1 bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">
          <PreviewPanel />
        </main>
      </div>
    </div>
  );
}
