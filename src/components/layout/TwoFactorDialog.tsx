import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppState } from "@/context/AppStateContext";

/**
 * 2FA PIN challenge shown before a role switch when
 * `config.twoFactorEnabled` is on. Port of the legacy `twoFactorModal` +
 * `submit2FA`/`cancel2FA` (reference/legacy_vanilla/js/config.js, G10
 * Scenarios 2 & 4): valid demo tokens are "123456" or "654321", 3 failed
 * attempts locks the system (see LockScreen.tsx).
 */
interface TwoFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VALID_PINS = ["123456", "654321"];

export function TwoFactorDialog({ open, onOpenChange }: TwoFactorDialogProps) {
  const { state, dispatch } = useAppState();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function reset() {
    setPin("");
    setError("");
  }

  function handleCancel() {
    reset();
    onOpenChange(false);
    toast.warning("Cambio de perfil cancelado.");
  }

  function handleSubmit() {
    if (VALID_PINS.includes(pin.trim())) {
      dispatch({ type: "RESET_FAILED_ATTEMPTS" });
      dispatch({ type: "CYCLE_ROLE" });
      dispatch({
        type: "ADD_AUDIT_LOG",
        payload: { action: "Token de seguridad 2FA verificado correctamente." },
      });
      toast.success("Token de seguridad 2FA verificado correctamente.");
      reset();
      onOpenChange(false);
      return;
    }

    const nextAttempts = state.session.failedAttempts + 1;
    dispatch({ type: "REGISTER_FAILED_ATTEMPT" });

    if (nextAttempts >= 3) {
      dispatch({
        type: "ADD_AUDIT_LOG",
        payload: { action: "SISTEMA BLOQUEADO: 3 intentos fallidos de token de seguridad 2FA" },
      });
      reset();
      onOpenChange(false);
      return;
    }

    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: {
        action: `Intento fallido de token 2FA por ${state.session.activeUser} (Intento #${nextAttempts})`,
      },
    });
    const remaining = 3 - nextAttempts;
    setError(`Token inválido. Te quedan ${remaining} intento${remaining === 1 ? "" : "s"} antes de bloquear la cuenta.`);
    setPin("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleCancel();
        else onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            Verificación en dos pasos
          </DialogTitle>
          <DialogDescription>
            Ingresa el token de seguridad de 6 dígitos para confirmar el cambio de perfil.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <InputOTP
            maxLength={6}
            value={pin}
            onChange={setPin}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && pin.length === 6) handleSubmit();
            }}
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-center text-xs font-medium text-destructive">{error}</p>}
          <p className="text-center text-xs text-muted-foreground">
            Demo: usa el token <span className="font-mono font-semibold">123456</span> o{" "}
            <span className="font-mono font-semibold">654321</span>.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={pin.length !== 6}>
            Verificar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
