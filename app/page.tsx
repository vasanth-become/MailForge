import Sidebar from "@/app/components/layout/Sidebar";
import Header from "@/app/components/layout/Header";
import PreviewPanel from "@/app/components/preview/PreviewPanel";

export default function Home() {
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
