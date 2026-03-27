"use client";

import dynamic from "next/dynamic";

// Must be called from a Client Component in the App Router.
// Skips SSR to prevent hydration mismatches from Zustand persist (localStorage)
// and new Date() locale differences between server and client.
const App = dynamic(() => import("@/app/components/layout/App"), { ssr: false });

export default function AppLoader() {
  return <App />;
}
