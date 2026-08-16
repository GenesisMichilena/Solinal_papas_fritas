/**
 * API Service - Cliente HTTP para comunicarse con el backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Tipos de respuesta de la API de IA
export interface AIAnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
  score: number;
}

export interface AISummaryResult {
  summary: string;
}

export interface AIGapsResult {
  gaps: string[];
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// Cliente API genérico
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// AI Endpoints
export const aiAPI = {
  /**
   * Analiza un documento contra un estándar de cumplimiento
   */
  analyzeCompliance: (content: string, standard: string) =>
    apiCall<AIAnalysisResult>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ content, standard }),
    }),

  /**
   * Genera un resumen de un documento
   */
  summarize: (content: string) =>
    apiCall<AISummaryResult>('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  /**
   * Identifica brechas de cumplimiento
   */
  identifyGaps: (content: string, requirements: string[]) =>
    apiCall<AIGapsResult>('/ai/identify-gaps', {
      method: 'POST',
      body: JSON.stringify({ content, requirements }),
    }),
};

// Documents Endpoints
export const documentsAPI = {
  /**
   * Obtiene todos los documentos
   */
  getAll: () =>
    apiCall('/documents', { method: 'GET' }),

  /**
   * Obtiene un documento por ID
   */
  getById: (id: string) =>
    apiCall(`/documents/${id}`, { method: 'GET' }),

  /**
   * Crea un nuevo documento
   */
  create: (data: any) =>
    apiCall('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Actualiza un documento
   */
  update: (id: string, data: any) =>
    apiCall(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Elimina un documento
   */
  delete: (id: string) =>
    apiCall(`/documents/${id}`, { method: 'DELETE' }),
};

// Compliance Endpoints
export const complianceAPI = {
  /**
   * Obtiene el estado de cumplimiento general
   */
  getStatus: () =>
    apiCall('/compliance', { method: 'GET' }),

  /**
   * Obtiene alertas de cumplimiento
   */
  getAlerts: () =>
    apiCall('/compliance/alerts', { method: 'GET' }),

  /**
   * Obtiene requisitos de cumplimiento
   */
  getRequirements: () =>
    apiCall('/compliance/requirements', { method: 'GET' }),
};

// Audit Endpoints
export const auditAPI = {
  /**
   * Obtiene todos los registros de auditoría
   */
  getLogs: (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    return apiCall(`/audit?${params.toString()}`, { method: 'GET' });
  },

  /**
   * Registra una acción de auditoría
   */
  log: (action: string, details: any) =>
    apiCall('/audit', {
      method: 'POST',
      body: JSON.stringify({ action, details }),
    }),
};

// Auth Endpoints
export const authAPI = {
  /**
   * Login del usuario
   */
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /**
   * Logout del usuario
   */
  logout: () =>
    apiCall('/auth/logout', { method: 'POST' }),

  /**
   * Verifica el token actual
   */
  verify: () =>
    apiCall('/auth/verify', { method: 'GET' }),
};
