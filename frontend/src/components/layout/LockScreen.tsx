import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/context/AppStateContext";

/**
 * Full-screen lock overlay shown after 3 failed 2FA attempts. Port of the
 * legacy `#lock-screen-overlay` + `unlockSystemDemo()`
 * (reference/legacy_vanilla/js/config.js, G10 Scenario 4) — the "unlock"
 * action is a labeled demo affordance, not real re-authentication, exactly
 * like the legacy prototype.
 */
export function LockScreen() {
  const { dispatch } = useAppState();

  function handleUnlock() {
    dispatch({ type: "UNLOCK_SYSTEM" });
    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: {
        action: "Sistema desbloqueado manualmente por el administrador (Simulado)",
      },
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-navy/95 px-6 text-center text-navy-foreground backdrop-blur-sm">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/20">
        <Lock className="size-8 text-destructive" />
      </div>
      <div>
        <h2 className="text-xl font-bold">Sistema bloqueado</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-navy-foreground/70">
          Se superó el número máximo de intentos de verificación 2FA. El acceso ha sido
          bloqueado por seguridad, según las políticas de doble factor de autenticación.
        </p>
      </div>
      <Button onClick={handleUnlock} className="mt-2">
        Desbloquear (demo)
      </Button>
    </div>
  );
}
