/**
 * Seed / mock data — direct port of reference/legacy_vanilla/js/state.js
 * (plus the static role metadata found in js/users.js and the config
 * fields read/written by js/config.js).
 *
 * DO NOT invent new records here. If a Phase 1 feature needs more mock
 * data than what exists in the legacy app, add it in your own
 * feature/route file, not here — this file is the shared contract.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The 5 legacy document types (see SolinalGestiona_MVP.html template selects). */
export type DocumentType =
  | "Procedimiento"
  | "Política"
  | "Manual"
  | "Instructivo"
  | "Checklist";

export type DocumentStatus =
  | "Borrador"
  | "En aprobación"
  | "Aprobado"
  | "Rechazado";

export interface SolinalDocument {
  code: string;
  title: string;
  type: DocumentType;
  norma: string;
  estado: DocumentStatus;
  version: string;
  creador: string;
  /** true if the document is past its review/expiry date */
  vencido: boolean;
  /** true if the document is flagged as critical (may require double approval) */
  critico: boolean;
  content: string;
  signatures: string[];
  revisiones: string[];
}

export interface DocumentTemplate {
  key: string;
  name: string;
  norma: string;
  type: DocumentType;
  desc: string;
  preview: string;
  content: string;
  mandatory: string[];
}

export interface AuditLogEntry {
  id: number;
  action: string;
  user: string;
  role: RoleName;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  ip: string;
}

export interface DocumentComment {
  code: string;
  author: string;
  date: string; // "YYYY-MM-DD HH:mm"
  text: string;
}

/** The 5 legacy roles, in Kanban column order (js/users.js). */
export type RoleName =
  | "Administrador"
  | "Elaborador"
  | "Revisor"
  | "Aprobador"
  | "Lector";

export interface AppUser {
  name: string;
  short: string;
  role: RoleName;
  /** Only present on users created via the "Nuevo usuario" modal (js/users.js). */
  status?: string;
  notes?: string;
}

export interface RoleMeta {
  role: RoleName;
  description: string;
  /** Legacy Tabler icon name, kept for reference — see Sidebar/Kanban for the lucide-react mapping. */
  legacyIcon: string;
}

/** Org-wide settings, ported from window.state config fields + js/config.js. */
export interface OrgConfig {
  orgName: string;
  brandColor: string;
  twoFactorEnabled: boolean;
  passwordPolicy: "weak" | "medium" | "strong";
  doubleApproval: "none" | "critical" | "all";
}

// ---------------------------------------------------------------------------
// Seed data (verbatim from legacy_vanilla/js/state.js)
// ---------------------------------------------------------------------------

export const seedDocuments: SolinalDocument[] = [
  {
    code: "PRO-CAL-009",
    title: "Control de Calidad Producto Terminado",
    type: "Procedimiento",
    norma: "ISO 9001:2015",
    estado: "Borrador",
    version: "v1.2",
    creador: "Ana Torres",
    vencido: false,
    critico: false,
    content:
      "1. Alcance: Definir los criterios de calidad para la liberación de producto terminado en la planta de papas fritas.\n2. Responsabilidades: El jefe de calidad es responsable de realizar los muestreos.\n3. Desarrollo: Inspección organoléptica, medición de humedad (máx 2%) y control de sellado de bolsas.\n4. Control de registros: Formato REG-CAL-015 guardado en servidor por 3 años.\n5. Firmas: Elaborado por Ana Torres.",
    signatures: [],
    revisiones: [
      "v1.1: Ajustes en límites de humedad",
      "v1.0: Carga inicial de procedimiento",
    ],
  },
  {
    code: "POL-GER-003",
    title: "Política de Inocuidad Alimentaria",
    type: "Política",
    norma: "ISO 22000:2018",
    estado: "En aprobación",
    version: "v2.0",
    creador: "Erick Murillo",
    vencido: false,
    critico: true,
    content:
      "1. Objetivo: Establecer el compromiso de Solinal S.A. con la inocuidad y cumplimiento normativo.\n2. Alcance: Aplicable a todo el personal de planta y administración.\n3. Declaración de Política: Elaborar alimentos seguros siguiendo los estándares HACCP e ISO 22000.\n4. Revisión: Anual por la gerencia.",
    signatures: ["Erick Murillo"],
    revisiones: ["v1.0: Emisión inicial aprobada en 2024"],
  },
  {
    code: "MAN-CAL-001",
    title: "Manual del SGC",
    type: "Manual",
    norma: "ISO 9001:2015",
    estado: "Aprobado",
    version: "v3.1",
    creador: "Erick Murillo",
    vencido: false,
    critico: true,
    content:
      "1. Alcance: Sistema de Gestión de Calidad para la producción de papas fritas.\n2. Exclusiones: Ninguna.\n3. Procesos Clave: Recepción de papa, pelado, corte, fritura, empacado y despacho.\n4. Política de Calidad integrada.",
    signatures: ["Erick Murillo", "Carlos Ruiz"],
    revisiones: [
      "v3.0: Adecuación a nueva estructura",
      "v2.0: Revisión bienal",
    ],
  },
  {
    code: "INS-PRO-012",
    title: "Instructivo de Limpieza CIP",
    type: "Instructivo",
    norma: "ISO 22000:2018",
    estado: "Rechazado",
    version: "v1.0",
    creador: "Ana Torres",
    vencido: false,
    critico: false,
    content:
      "1. Preparación: Apagar línea de fritura y purgar remanente de aceite.\n2. Lavado cáustico: Circular solución de NaOH al 1.5% a 75°C durante 20 minutes.\n3. Enjuague: Con agua potable hasta pH neutro.\n4. Registro: Anotar en bitácora de limpieza.",
    signatures: [],
    revisiones: [],
  },
  {
    code: "CHK-HAC-001",
    title: "Checklist Control de Alérgenos",
    type: "Checklist",
    norma: "ISO 22000:2018",
    estado: "Aprobado",
    version: "v1.5",
    creador: "Nicolas Fiallo",
    vencido: true,
    critico: false,
    content:
      "1. Verificación de limpieza de línea tras procesar papas con sabor a queso.\n2. Inspección visual de residuos de polvo sazonador.\n3. Prueba rápida de flujo lateral para alérgenos de leche.\n4. Liberación de línea por supervisor.",
    signatures: ["Nicolas Fiallo"],
    revisiones: ["v1.4: Actualización de kit de prueba rápida"],
  },
  {
    code: "REG-AMB-002",
    title: "Registro de Residuos Sólidos",
    type: "Instructivo",
    norma: "ISO 14001:2015",
    estado: "Aprobado",
    version: "v1.0",
    creador: "Nicolas Fiallo",
    vencido: true,
    critico: false,
    content:
      "1. Objetivo: Registrar la cantidad de residuos orgánicos e inorgánicos generados diariamente.\n2. Disposición: Desechos de papa a compostaje; empaques plásticos a reciclaje.",
    signatures: ["Nicolas Fiallo"],
    revisiones: [],
  },
  {
    code: "PRO-SEG-005",
    title: "Procedimiento de Trazabilidad y Retiro",
    type: "Procedimiento",
    norma: "ISO 22000:2018",
    estado: "Aprobado",
    version: "v2.1",
    creador: "Carlos Ruiz",
    vencido: true,
    critico: true,
    content:
      "1. Alcance: Trazabilidad de materia prima (papa, aceite, sazonador) hasta cliente final.\n2. Simulacro de retiro: Dos veces al año, meta de efectividad 98% en 4 horas.",
    signatures: ["Carlos Ruiz"],
    revisiones: ["v2.0: Ajuste de tiempos de retiro"],
  },
];

export const seedTemplates: DocumentTemplate[] = [
  {
    key: "procedimiento",
    name: "Procedimiento ISO 9001",
    norma: "ISO 9001:2015",
    type: "Procedimiento",
    desc: "Estructura con alcance, responsabilidades, control de cambios y registros.",
    preview: "Incluye alcance, responsables, registros y control de cambios.",
    content:
      "1. Alcance\n2. Responsabilidades\n3. Recursos y controles\n4. Registro de calidad\n5. Control de cambios",
    mandatory: ["Alcance", "Responsabilidades"],
  },
  {
    key: "politica",
    name: "Política de Calidad",
    norma: "ISO 9001:2015",
    type: "Política",
    desc: "Documento maestro con firma obligatoria y revisión anual.",
    preview: "Incluye firma obligatoria, revisión anual y autoridad responsable.",
    content:
      "1. Objetivo\n2. Alcance\n3. Declaración de política\n4. Responsabilidades\n5. Revisión y firma",
    mandatory: ["Declaración de política", "Firma"],
  },
  {
    key: "checklist",
    name: "Checklist HACCP",
    norma: "ISO 22000:2018",
    type: "Checklist",
    desc: "Formato verificable con alérgenos y responsables.",
    preview: "Incluye puntos de control, evidencia y responsables de verificación.",
    content:
      "1. Inspección de calidad\n2. Verificación de temperatura\n3. Confirmación de proveedores\n4. Registro de no conformidades",
    mandatory: ["Puntos de control"],
  },
  {
    key: "instructivo",
    name: "Instructivo de Limpieza",
    norma: "ISO 22000:2018",
    type: "Instructivo",
    desc: "Guía paso a paso para control de higiene y actividades operativas.",
    preview: "Incluye pasos, herramientas necesarias y evidencia de control.",
    content:
      "1. Preparación\n2. Enjuague inicial\n3. Aplicación de detergente\n4. Enjuague final\n5. Verificación de limpieza",
    mandatory: ["Pasos de limpieza"],
  },
];

export const seedAuditLogs: AuditLogEntry[] = [
  {
    id: 1,
    action: "Documento POL-GER-003 aprobado",
    user: "Carlos Ruiz",
    role: "Aprobador",
    date: "2026-06-20",
    time: "09:14",
    ip: "190.45.23.10",
  },
  {
    id: 2,
    action: "Documento INS-PRO-012 rechazado",
    user: "Ana Torres",
    role: "Revisor",
    date: "2026-06-19",
    time: "16:08",
    ip: "190.45.23.82",
  },
  {
    id: 3,
    action: "Usuario añadido al sistema (Ana Torres)",
    user: "Erick Murillo",
    role: "Administrador",
    date: "2026-06-17",
    time: "11:42",
    ip: "190.45.23.66",
  },
  {
    id: 4,
    action: "Documento MAN-CAL-001 restaurado a v3.1",
    user: "Erick Murillo",
    role: "Administrador",
    date: "2026-06-17",
    time: "10:05",
    ip: "190.45.23.66",
  },
];

export const seedComments: DocumentComment[] = [
  {
    code: "PRO-CAL-009",
    author: "Ana Torres",
    date: "2026-06-21 00:30",
    text: "¿Se requiere agregar la firma del director de planta aquí?",
  },
  {
    code: "POL-GER-003",
    author: "Carlos Ruiz",
    date: "2026-06-20 18:45",
    text: "Esta política debe ser difundida a todos los colaboradores antes de fin de mes.",
  },
];

export const seedUsers: AppUser[] = [
  { name: "Erick Murillo", short: "EM", role: "Administrador" },
  { name: "Nicolas Fiallo", short: "NF", role: "Elaborador" },
  { name: "Ana Torres", short: "AT", role: "Revisor" },
  { name: "Carlos Ruiz", short: "CR", role: "Aprobador" },
  { name: "Lector Simulado", short: "LS", role: "Lector" },
];

/** Role list + description + legacy icon, ported from js/users.js renderKanban(). */
export const roleMeta: RoleMeta[] = [
  {
    role: "Administrador",
    description: "Acceso total y control global",
    legacyIcon: "ti-crown",
  },
  {
    role: "Elaborador",
    description: "Creación de borradores",
    legacyIcon: "ti-pencil",
  },
  {
    role: "Revisor",
    description: "Comentarios técnicos",
    legacyIcon: "ti-search",
  },
  {
    role: "Aprobador",
    description: "Firma y doble validación",
    legacyIcon: "ti-shield-check",
  },
  {
    role: "Lector",
    description: "Consulta de aprobados",
    legacyIcon: "ti-eye",
  },
];

/** Legacy `window.pages` order, used to build the sidebar / router 1:1. */
export const legacyPageOrder = [
  "dash",
  "docs",
  "edit",
  "comp",
  "templates",
  "audit",
  "users",
  "config",
] as const;

/** Pages the "Lector" role cannot access (js/navigation.js goPage / applyRoleRestrictiveness). */
export const lectorRestrictedPages: Array<(typeof legacyPageOrder)[number]> = [
  "edit",
  "templates",
  "audit",
  "config",
];

export const seedConfig: OrgConfig = {
  orgName: "Solinal S.A.",
  brandColor: "#1B4F8A",
  twoFactorEnabled: false,
  passwordPolicy: "strong",
  doubleApproval: "critical",
};

/** Initial active session values (window.state.activeRole / activeUser / etc). */
export const initialSession = {
  isAuthenticated: false,
  activeRole: "Administrador" as RoleName,
  activeUser: "Erick Murillo",
  isLocked: false,
  failedAttempts: 0,
  activeDocCode: "PRO-CAL-009",
  isSectionLocked: false,
};
