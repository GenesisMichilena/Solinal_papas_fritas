import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { TwoFactorDialog } from "./TwoFactorDialog";

/**
 * Topbar — based on the legacy #topbar (search box, notification bell,
 * user chip with avatar/name/role). Clicking the user chip cycles the
 * active role, same as the legacy `cycleRole()`
 * (reference/legacy_vanilla/js/navigation.js). When
 * `config.twoFactorEnabled` is on (Configuracion > Seguridad), the switch
 * is gated behind a 2FA PIN challenge first, same as legacy G10 Scenario 2
 * — see TwoFactorDialog.tsx.
 */
export function Topbar() {
  const { state, dispatch } = useAppState();
  const { activeUser, activeRole } = state.session;
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const initials = activeUser
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleRoleChipClick() {
    if (state.config.twoFactorEnabled) {
      setTwoFactorOpen(true);
      return;
    }
    dispatch({ type: "CYCLE_ROLE" });
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-6">
      <div className="flex flex-1 items-center gap-2 rounded-lg bg-muted px-3 py-2 max-w-md">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar documentos, normas..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notificaciones"
        >
          <Bell className="size-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </button>

        <button
          type="button"
          onClick={handleRoleChipClick}
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-semibold text-foreground">
              {activeUser}
            </span>
            <span className="block text-xs text-muted-foreground">
              · {activeRole}
            </span>
          </span>
        </button>
      </div>

      <TwoFactorDialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen} />
    </header>
  );
}
