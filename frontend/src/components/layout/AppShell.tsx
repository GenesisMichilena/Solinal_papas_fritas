import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { LockScreen } from "./LockScreen";
import { useAppState } from "@/context/AppStateContext";

/** Combines Sidebar + Topbar + routed page content. Also renders the
 * global lock-screen overlay (session.isLocked) on top of every route
 * when 3 failed 2FA attempts have been registered — see Topbar.tsx /
 * TwoFactorDialog.tsx / LockScreen.tsx. */
export function AppShell() {
  const { state } = useAppState();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      {state.session.isLocked && <LockScreen />}
    </div>
  );
}
