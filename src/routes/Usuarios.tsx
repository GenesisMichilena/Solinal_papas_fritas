import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/context/AppStateContext";
import type { RoleName } from "@/data/seed";
import { roleMeta } from "@/data/seed";
import { RoleCard } from "@/features/users/RoleCard";
import { NewUserDialog } from "@/features/users/NewUserDialog";

/**
 * Port of legacy pg-users: role summary cards + Kanban board
 * (reference/legacy_vanilla/js/users.js renderKanban()), merged into a
 * single grid of role cards — each card already lists its description,
 * assigned people, and an "+Agregar" action, so the separate static
 * info-card row from the legacy markup is folded into this same grid.
 */
export default function Usuarios() {
  const { state, dispatch } = useAppState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState<RoleName>("Elaborador");

  // Only Administrador may reassign roles or register new users — creating a
  // user also assigns its initial role (see NewUserDialog), so both actions
  // share the same gate.
  const canManage = state.session.activeRole === "Administrador";

  function openDialogFor(role: RoleName) {
    if (!canManage) return;
    setDefaultRole(role);
    setDialogOpen(true);
  }

  function handleRoleChange(userName: string, role: RoleName) {
    if (!canManage) {
      toast.error("Solo un Administrador puede reasignar roles.");
      dispatch({
        type: "ADD_AUDIT_LOG",
        payload: {
          action: `Intento no autorizado de cambiar el rol de ${userName} por ${state.session.activeUser} (Rol: ${state.session.activeRole})`,
        },
      });
      return;
    }
    // UPDATE_USER_ROLE already syncs session.activeRole when userName is
    // the active user, mirroring legacy dropCard()'s live permission update.
    dispatch({ type: "UPDATE_USER_ROLE", payload: { name: userName, role } });
    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: { action: `Cambió el rol del usuario ${userName} a ${role}` },
    });
    toast.success(`Usuario ${userName} movido a ${role}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Usuarios y Roles Organizacionales
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {canManage
              ? "Control de accesos y flujo documental. Reasigna el rol de cada persona desde su tarjeta para aplicar el cambio de inmediato."
              : "Control de accesos y flujo documental. Solo un Administrador puede reasignar roles o registrar nuevos usuarios."}
          </p>
        </div>
        {canManage && (
          <Button className="gap-2" onClick={() => openDialogFor("Elaborador")}>
            <UserPlus className="size-4" />
            Nuevo usuario
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {roleMeta.map((meta) => (
          <RoleCard
            key={meta.role}
            meta={meta}
            users={state.users.filter((u) => u.role === meta.role)}
            canManage={canManage}
            onAddClick={() => openDialogFor(meta.role)}
            onRoleChange={handleRoleChange}
          />
        ))}
      </div>

      <NewUserDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultRole={defaultRole} />
    </div>
  );
}
