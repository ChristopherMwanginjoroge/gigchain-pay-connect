import { Outlet } from "react-router-dom";
import AppNav from "@/components/app/AppNav";

const AppLayout = () => {
  return (
    <div className="min-h-screen app-shell-bg text-slate-100 font-app">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-28 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      <AppNav />
      <main className="relative container max-w-6xl px-4 pb-12 pt-6 md:pt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
