import { useMemo, useState } from "react";
import { Download, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/context/AppStateContext";
import { AuditFilters, defaultAuditFilters, type AuditFilterState } from "@/features/audit/AuditFilters";
import { AuditLogTable } from "@/features/audit/AuditLogTable";
import { exportAuditCsv } from "@/features/audit/exportCsv";

/**
 * Port of legacy pg-audit (Audit Trail inmutable). Filtering/export are
 * client-side, same as the legacy simulation; "Intentar Borrar Historial"
 * stays a no-op that only logs the attempt, exactly like
 * simulateUnauthorizedAuditEdit() in js/audit.js.
 */
export default function Auditoria() {
  const { state, dispatch } = useAppState();
  const [filters, setFilters] = useState<AuditFilterState>(defaultAuditFilters);

  const users = useMemo(
    () => [...new Set(state.auditLogs.map((l) => l.user))],
    [state.auditLogs],
  );
  const docCodes = useMemo(() => state.documents.map((d) => d.code), [state.documents]);

  const filteredLogs = useMemo(() => {
    return state.auditLogs.filter((l) => {
      if (filters.user !== "all" && l.user !== filters.user) return false;
      if (filters.doc !== "all" && !l.action.includes(filters.doc)) return false;
      if (filters.role !== "all" && l.role !== filters.role) return false;
      return true;
    });
  }, [state.auditLogs, filters]);

  const isRestricted = state.session.activeRole === "Lector";

  function handleExport() {
    exportAuditCsv(filteredLogs);
    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: { action: "Exportó registros de auditoría a CSV" },
    });
    toast.success("CSV de auditoría descargado exitosamente.");
  }

  function handleUnauthorizedEdit() {
    toast.error("Registro inmutable: las regulaciones ISO prohíben la modificación del Audit Trail.");
    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: {
        action: "Intento fallido de eliminación del Audit Trail por usuario no autorizado",
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Audit Trail (Historial de Auditoría Inmutable)
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Registro trazable de acciones del sistema bajo normas ISO: creación, edición,
            aprobación e intentos no autorizados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" className="gap-1.5" onClick={handleUnauthorizedEdit}>
            <Trash2 className="size-3.5" />
            Intentar borrar historial
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleExport}>
            <Download className="size-3.5" />
            Exportar CSV completo
          </Button>
        </div>
      </div>

      {isRestricted ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <ShieldAlert className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Acceso restringido</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              El rol Lector solo puede consultar documentos aprobados. El historial de
              auditoría está reservado a roles con permisos de gestión.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="py-4">
              <AuditFilters
                users={users}
                docCodes={docCodes}
                value={filters}
                onChange={setFilters}
                onClear={() => setFilters(defaultAuditFilters)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <AuditLogTable logs={filteredLogs} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
