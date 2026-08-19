import {
  createContext,
  useContext,
  useEffect,
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
  isAuthenticated: boolean;
  activeRole: RoleName;
  activeUser: string;
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

const SESSION_STORAGE_KEY = "solinal-gestiona:session";

function loadPersistedSession(): SessionState {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return { ...initialSession };
    return { ...initialSession, ...(JSON.parse(raw) as Partial<SessionState>) };
  } catch {
    return { ...initialSession };
  }
}

export const initialAppState: AppState = {
  documents: seedDocuments,
  templates: seedTemplates,
  auditLogs: seedAuditLogs,
  comments: seedComments,
  users: seedUsers,
  config: seedConfig,
  session: loadPersistedSession(),
};


export type AppAction =
  // --- session / auth -------------------------------------------------
  | { type: "LOGIN"; payload: { user: string; role: RoleName } }
  | { type: "LOGOUT" }
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


  // -- compliance/templates feature (src/routes/Plantillas.tsx) --
  | { type: "TEMPLATE_ADD"; payload: DocumentTemplate }

  | { type: "__NOOP" };


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
    case "LOGIN": {
      const { user, role } = action.payload;
      return {
        ...state,
        session: { ...state.session, isAuthenticated: true, activeUser: user, activeRole: role },
      };
    }

    case "LOGOUT":
      return { ...state, session: { ...initialSession } };

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


    // -- compliance/templates feature (src/routes/Plantillas.tsx) --
    case "TEMPLATE_ADD":
      return { ...state, templates: [...state.templates, action.payload] };

    case "__NOOP":
      return state;

    default:
      return state;
  }
}

interface AppStateContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined,
);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.session));
    } catch {
      // localStorage unavailable (private mode/quota) — session just won't
      // survive a reload, not worth surfacing to the user.
    }
  }, [state.session]);

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
