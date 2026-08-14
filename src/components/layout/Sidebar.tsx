import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Files,
  FileText,
  ShieldCheck,
  LayoutGrid,
  History,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/AppStateContext";
import logoIcon from "@/assets/logo-icon.png";

/**
 * Sidebar — visual pattern (navy background, mint accent, logo treatment)
 * ported from reference/lovable_mvp/src/components/solinal/Sidebar.tsx,
 * but with the 8 nav items from the legacy sidebar
 * (reference/legacy_vanilla/SolinalGestiona_MVP.html #sidebar), each
 * wired to its React Router route per DESIGN_SYSTEM.md section 2.
 *
 * Icon mapping (legacy Tabler -> lucide-react):
 *   ti-layout-dashboard -> LayoutDashboard
 *   ti-files             -> Files
 *   ti-file-text          -> FileText
 *   ti-shield-check       -> ShieldCheck
 *   ti-layout-grid        -> LayoutGrid
 *   ti-list-search        -> History (no direct "list+magnifier" icon in
 *                             lucide-react; History best matches the
 *                             semantic meaning of an audit trail log)
 *   ti-users              -> Users
 *   ti-settings           -> Settings
 */

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  /** Legacy page id (window.pages), kept for role-restriction parity. */
  legacyPage: string;
}

const nav: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, legacyPage: "dash" },
  { label: "Documentos", to: "/documentos", icon: Files, legacyPage: "docs" },
  { label: "Editor & IA", to: "/editor", icon: FileText, legacyPage: "edit" },
  {
    label: "Cumplimiento ISO",
    to: "/cumplimiento",
    icon: ShieldCheck,
    legacyPage: "comp",
  },
  {
    label: "Plantillas",
    to: "/plantillas",
    icon: LayoutGrid,
    legacyPage: "templates",
  },
  {
    label: "Audit Trail",
    to: "/auditoria",
    icon: History,
    legacyPage: "audit",
  },
  {
    label: "Usuarios y roles",
    to: "/usuarios",
    icon: Users,
    legacyPage: "users",
  },
  {
    label: "Configuración",
    to: "/configuracion",
    icon: Settings,
    legacyPage: "config",
  },
];

/** Pages the "Lector" role cannot access (legacy js/navigation.js). */
const lectorRestricted = new Set(["edit", "templates", "audit", "config"]);

export function Sidebar() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const isLector = state.session.activeRole === "Lector";
  const docCount = state.documents.length;

  function handleLogout() {
    dispatch({
      type: "ADD_AUDIT_LOG",
      payload: { action: `Cerró sesión (${state.session.activeUser})` },
    });
    dispatch({ type: "LOGOUT" });
    toast.success("Sesión cerrada.");
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col bg-sidebar px-6 py-7 text-sidebar-foreground lg:flex">
      <div className="flex items-center gap-3 px-2">
        <img src={logoIcon} alt="" className="size-8 object-contain" />
        <div className="leading-none">
          <p className="text-xl font-bold tracking-tight">
            SOLINAL<span className="text-sidebar-primary">.</span>
          </p>
          <p className="text-xs font-medium text-sidebar-foreground/70">
            Gestiona MVP
          </p>
        </div>
      </div>

      <div className="my-6 border-t border-sidebar-border" />

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {nav.map(({ label, to, icon: Icon, legacyPage }) => {
          if (isLector && lectorRestricted.has(legacyPage)) return null;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )
              }
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="flex-1">{label}</span>
              {legacyPage === "docs" && docCount > 0 && (
                <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-[11px] font-bold text-sidebar-primary-foreground">
                  {docCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-3 border-t border-sidebar-border pt-3">
        <div className="flex items-center gap-2.5 px-2 pb-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
            {state.session.activeUser
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold">
              {state.session.activeUser}
            </span>
            <span className="block truncate text-xs text-sidebar-foreground/60">
              {state.session.activeRole}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-destructive"
        >
          <LogOut className="size-[18px] shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
