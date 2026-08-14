import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppState } from "@/context/AppStateContext";
import type { RoleName } from "@/data/seed";
import { roleOrder, initialsOf } from "./roleTheme";

const statusOptions = ["Activo", "Invitado", "Inactivo"] as const;

/**
 * Port of the legacy "newUserModal" (SolinalGestiona_MVP.html) +
 * js/users.js saveNewUser(). Uses the shared ADD_USER + ADD_AUDIT_LOG
 * foundation actions rather than any new reducer case.
 */
export function NewUserDialog({
  open,
  onOpenChange,
  defaultRole,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole: RoleName;
}) {
  const { state, dispatch } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleName>(defaultRole);
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("Activo");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) setRole(defaultRole);
  }, [open, defaultRole]);

  function reset() {
    setName("");
    setEmail("");
    setStatus("Activo");
    setNotes("");
  }

  function handleSave() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) {
      toast.error("Por favor, ingresa el nombre y correo del usuario.");
      return;
    }
    if (state.users.some((u) => u.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error("Ya existe un usuario registrado con ese nombre.");
      return;
    }

    dispatch({
      type: "ADD_USER",
      payload: {
        name: trimmedName,
        short: initialsOf(trimmedName),
        role,
        status,
        notes: notes.trim(),
      },
    });
    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: { action: `Registró nuevo usuario: ${trimmedName} (${role})` },
    });
    toast.success(`Usuario ${trimmedName} registrado con rol ${role}.`);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar nuevo usuario</DialogTitle>
          <DialogDescription>
            Se le asignará un rol organizacional con permisos predefinidos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="newUserName">Nombre completo</Label>
              <Input
                id="newUserName"
                placeholder="Ej. Ana Torres"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="newUserEmail">Correo electrónico</Label>
              <Input
                id="newUserEmail"
                type="email"
                placeholder="ana@solinal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Rol asignado</Label>
              <Select value={role} onValueChange={(v) => setRole(v as RoleName)}>
                <SelectTrigger className="bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOrder.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Estado</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as (typeof statusOptions)[number])}
              >
                <SelectTrigger className="bg-muted">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="newUserNotes">Notas / Ubicación / Normas a cargo</Label>
            <Textarea
              id="newUserNotes"
              placeholder="Planta Central, Auditor interno..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-muted"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar usuario</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
