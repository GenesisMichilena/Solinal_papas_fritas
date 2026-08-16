import { useEffect, useState } from "react";
import { Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/context/AppStateContext";
import type { OrgConfig } from "@/data/seed";
import { IdentitySection } from "@/features/config/IdentitySection";
import { SecuritySection } from "@/features/config/SecuritySection";

/**
 * Port of legacy pg-config. Form fields are edited as a local draft (like
 * the legacy form, which only read the DOM inputs on
 * saveConfigurationSettings()) and committed to global state via the
 * shared UPDATE_CONFIG action on "Guardar cambios".
 */
export default function Configuracion() {
  const { state, dispatch } = useAppState();
  const [draft, setDraft] = useState<OrgConfig>(state.config);

  // Keep the draft in sync if config is updated elsewhere (e.g. another
  // tab/agent dispatching UPDATE_CONFIG directly).
  useEffect(() => setDraft(state.config), [state.config]);

  const isRestricted = state.session.activeRole === "Lector";

  function handleChange(changes: Partial<OrgConfig>) {
    setDraft((prev) => ({ ...prev, ...changes }));
  }

  function handleSave() {
    dispatch({ type: "UPDATE_CONFIG", payload: draft });
    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: { action: "Actualizó políticas de seguridad e identidad visual del sistema" },
    });
    toast.success("Configuraciones guardadas y aplicadas al sistema.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración del sistema</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajustes globales del tenant, personalización visual y políticas de seguridad.
          </p>
        </div>
        {!isRestricted && (
          <Button className="gap-2" onClick={handleSave}>
            <Save className="size-4" />
            Guardar cambios
          </Button>
        )}
      </div>

      {isRestricted ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <ShieldAlert className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Acceso restringido</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              El rol Lector no tiene permisos para modificar la configuración del sistema.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <IdentitySection draft={draft} onChange={handleChange} />
          <SecuritySection draft={draft} onChange={handleChange} />
        </div>
      )}
    </div>
  );
}
