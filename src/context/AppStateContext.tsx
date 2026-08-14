import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  seedDocuments,
  seedTemplates,
  seedAuditLogs,
  seedComments,
  seedUsers,
  seedConfig,
  initialSession,
  type SolinalDocument,
  type DocumentTemplate,
  type AuditLogEntry,
  type DocumentComment,
  type AppUser,
  type OrgConfig,
  type RoleName,
} from "@/data/seed";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface SessionState {
  activeRole: RoleName;
  activeUser: string;
  roleIndex: number;
  isLocked: boolean;
  failedAttempts: number;
  /** Code of the document currently open in the editor. */
  activeDocCode: string;
  isSectionLocked: boolean;
}

export interface AppState {
  documents: SolinalDocument[];
  templates: DocumentTemplate[];
  auditLogs: AuditLogEntry[];
  comments: DocumentComment[];
  users: AppUser[];
  config: OrgConfig;
  session: SessionState;
}

export const initialAppState: AppState = {
  documents: seedDocuments,
  templates: seedTemplates,
  auditLogs: seedAuditLogs,
  comments: seedComments,
  users: seedUsers,
  config: seedConfig,
  session: { ...initialSession },
};

// ---------------------------------------------------------------------------
// Actions
//
// This is the foundation set of actions implied by the legacy JS
// (navigation.js executeRoleChange, state.js logAuditAction, documents.js
// CRUD, users.js kanban drag/drop, config.js settings form).
//
// Phase 1 feature agents: add NEW action types only inside the
// "FEATURE-AGENT EXTENSIONS" block below, each in its own clearly
// commented sub-section with your feature name. Do not edit the actions
// above that line — they are shared foundation actions other pages rely
// on too.
// ---------------------------------------------------------------------------

export type AppAction =
  // --- session / auth -------------------------------------------------
  | { type: "SET_CURRENT_ROLE"; payload: { user: string; role: RoleName } }
  | { type: "CYCLE_ROLE" }
  | { type: "LOCK_SYSTEM" }
  | { type: "UNLOCK_SYSTEM" }
  | { type: "REGISTER_FAILED_ATTEMPT" }
  | { type: "RESET_FAILED_ATTEMPTS" }
  | { type: "SET_ACTIVE_DOC"; payload: { code: string } }
  | { type: "SET_SECTION_LOCKED"; payload: { locked: boolean } }

  // --- documents --------------------------------------------------------
  | {
      type: "UPDATE_DOCUMENT";
      payload: { code: string; changes: Partial<SolinalDocument> };
    }
  | { type: "ADD_DOCUMENT"; payload: SolinalDocument }

  // --- comments -----------------------------------------------------------
  | { type: "ADD_COMMENT"; payload: DocumentComment }

  // --- users / roles ------------------------------------------------------
  | { type: "ADD_USER"; payload: AppUser }
  | { type: "UPDATE_USER_ROLE"; payload: { name: string; role: RoleName } }

  // --- config / branding ----------------------------------------------
  | { type: "UPDATE_CONFIG"; payload: Partial<OrgConfig> }

  // --- audit trail -------------------------------------------------------
  | { type: "ADD_AUDIT_LOG"; payload: { action: string } }

  // ---------------------------------------------------------------------
  // FEATURE-AGENT EXTENSIONS
  // Add your new action types below this line, in their own commented
  // sub-section (e.g. "-- documents feature --"). Do NOT remove or edit
  // other agents' sections; resolved/reconciled in Phase 2 (integration-qa).
  // ---------------------------------------------------------------------

  // -- compliance/templates feature (src/routes/Plantillas.tsx) --
  | { type: "TEMPLATE_ADD"; payload: DocumentTemplate }

  | { type: "__NOOP" };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function makeAuditLog(
  state: AppState,
  action: string,
): AuditLogEntry {
  const now = new Date();
  return {
    id: state.auditLogs.length
      ? Math.max(...state.auditLogs.map((l) => l.id)) + 1
      : 1,
    action,
    user: state.session.activeUser,
    role: state.session.activeRole,
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 5),
    ip: `192.168.1.${Math.floor(Math.random() * 254 + 1)}`,
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CURRENT_ROLE": {
      const { user, role } = action.payload;
      return {
        ...state,
        session: { ...state.session, activeUser: user, activeRole: role },
      };
    }

    case "CYCLE_ROLE": {
      const nextIndex = (state.session.roleIndex + 1) % state.users.length;
      const nextUser = state.users[nextIndex];
      if (!nextUser) return state;
      return {
        ...state,
        session: {
          ...state.session,
          roleIndex: nextIndex,
          activeUser: nextUser.name,
          activeRole: nextUser.role,
        },
      };
    }

    case "LOCK_SYSTEM":
      return { ...state, session: { ...state.session, isLocked: true } };

    case "UNLOCK_SYSTEM":
      return {
        ...state,
        session: { ...state.session, isLocked: false, failedAttempts: 0 },
      };

    case "REGISTER_FAILED_ATTEMPT": {
      const failedAttempts = state.session.failedAttempts + 1;
      return {
        ...state,
        session: {
          ...state.session,
          failedAttempts,
          isLocked: failedAttempts >= 3 ? true : state.session.isLocked,
        },
      };
    }

    case "RESET_FAILED_ATTEMPTS":
      return { ...state, session: { ...state.session, failedAttempts: 0 } };

    case "SET_ACTIVE_DOC":
      return {
        ...state,
        session: { ...state.session, activeDocCode: action.payload.code },
      };

    case "SET_SECTION_LOCKED":
      return {
        ...state,
        session: {
          ...state.session,
          isSectionLocked: action.payload.locked,
        },
      };

    case "UPDATE_DOCUMENT": {
      const { code, changes } = action.payload;
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.code === code ? { ...doc, ...changes } : doc,
        ),
      };
    }

    case "ADD_DOCUMENT":
      return { ...state, documents: [...state.documents, action.payload] };

    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.payload] };

    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };

    case "UPDATE_USER_ROLE": {
      const { name, role } = action.payload;
      const users = state.users.map((u) =>
        u.name === name ? { ...u, role } : u,
      );
      const session =
        state.session.activeUser === name
          ? { ...state.session, activeRole: role }
          : state.session;
      return { ...state, users, session };
    }

    case "UPDATE_CONFIG":
      return { ...state, config: { ...state.config, ...action.payload } };

    case "ADD_AUDIT_LOG":
      return {
        ...state,
        auditLogs: [makeAuditLog(state, action.payload.action), ...state.auditLogs],
      };

    // -----------------------------------------------------------------
    // FEATURE-AGENT EXTENSIONS: add new `case` branches below this line,
    // matching the action types you added above.
    // -----------------------------------------------------------------

    // -- compliance/templates feature (src/routes/Plantillas.tsx) --
    case "TEMPLATE_ADD":
      return { ...state, templates: [...state.templates, action.payload] };

    case "__NOOP":
      return state;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context + hook
// ---------------------------------------------------------------------------

interface AppStateContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined,
);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

/** Read + dispatch access to the global app state. */
export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}
