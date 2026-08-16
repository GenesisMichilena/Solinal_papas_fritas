# 📊 Diagramas UML - Solinal

## 1. DIAGRAMA DE CASOS DE USO

Este diagrama muestra las interacciones entre los actores y el sistema Solinal.

```mermaid
graph TD
    A[Usuario Auditor] -->|Ver Documentos| UC1["📋 Gestionar Documentos"]
    A -->|Crear Reportes| UC2["📊 Generar Reportes de Auditoría"]
    A -->|Ver Cumplimiento| UC3["✓ Monitorear Cumplimiento"]
    
    B[Usuario Administrador] -->|Crear Usuarios| UC4["👥 Administrar Usuarios"]
    B -->|Configurar Sistema| UC5["⚙️ Configuración de Sistema"]
    B -->|Asignar Roles| UC6["🔐 Gestionar Permisos"]
    
    C[Usuario Analista] -->|Análisis con IA| UC7["🤖 Analizar Cumplimiento con IA"]
    C -->|Generar Resúmenes| UC8["📝 Generar Resúmenes Automáticos"]
    C -->|Identificar Brechas| UC9["🔍 Identificar Brechas de Cumplimiento"]
    
    UC1 -.->|Usa| DB["🗄️ Base de Datos"]
    UC2 -.->|Genera| REPORT["📄 Reportes PDF/CSV"]
    UC3 -.->|Consulta| AI["🤖 Claude API"]
    UC7 -.->|Llama| AI
    UC8 -.->|Llama| AI
    UC9 -.->|Llama| AI
    UC4 -.->|Modifica| DB
    UC5 -.->|Configura| SYS["🖥️ Sistema"]
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style UC7 fill:#e8f5e9
    style UC8 fill:#e8f5e9
    style UC9 fill:#e8f5e9
    style AI fill:#ffe0b2
```

---

## 2. CASOS DE USO DETALLADOS

### 📋 **UC1: Gestionar Documentos**
| Elemento | Descripción |
|----------|-------------|
| **Actor Principal** | Usuario Auditor |
| **Precondición** | Usuario autenticado |
| **Flujo Principal** | 1. Ver lista de documentos<br>2. Crear nuevo documento<br>3. Editar documento existente<br>4. Eliminar documento<br>5. Ver historial de cambios |
| **Postcondición** | Documento guardado en BD |

### 📊 **UC2: Generar Reportes de Auditoría**
| Elemento | Descripción |
|----------|-------------|
| **Actor Principal** | Usuario Auditor |
| **Precondición** | Documentos disponibles en sistema |
| **Flujo Principal** | 1. Seleccionar rango de fechas<br>2. Elegir criterios de filtro<br>3. Generar reporte<br>4. Descargar en PDF/CSV |
| **Postcondición** | Reporte generado y descargado |

### 🤖 **UC7: Analizar Cumplimiento con IA**
| Elemento | Descripción |
|----------|-------------|
| **Actor Principal** | Usuario Analista |
| **Precondición** | Documento cargado, API Claude activa |
| **Flujo Principal** | 1. Seleccionar documento<br>2. Elegir estándar (ISO 27001, GDPR, etc.)<br>3. Enviar a análisis IA<br>4. Recibir análisis con puntuación<br>5. Ver riesgos y recomendaciones |
| **Postcondición** | Análisis guardado en histórico |
| **Excepciones** | Si API falla → mostrar error |

### 📝 **UC8: Generar Resúmenes Automáticos**
| Elemento | Descripción |
|----------|-------------|
| **Actor Principal** | Usuario Analista |
| **Precondición** | Documento cargado |
| **Flujo Principal** | 1. Seleccionar documento<br>2. Solicitar resumen con IA<br>3. Recibir resumen resumido (max 200 palabras)<br>4. Copiar o descargar resumen |
| **Postcondición** | Resumen disponible en interfaz |

### 🔍 **UC9: Identificar Brechas de Cumplimiento**
| Elemento | Descripción |
|----------|-------------|
| **Actor Principal** | Usuario Analista |
| **Precondición** | Documento + Requisitos definidos |
| **Flujo Principal** | 1. Cargar documento<br>2. Ingresar requisitos<br>3. Ejecutar análisis de brechas<br>4. Recibir lista de brechas<br>5. Ver nivel de severidad |
| **Postcondición** | Informe de brechas generado |

---

## 3. CASOS DE USO SECUNDARIOS

### 👥 **UC4: Administrar Usuarios**
| Elemento | Descripción |
|----------|-------------|
| **Actor Principal** | Administrador |
| **Casos Incluidos** | Crear usuario, Editar usuario, Eliminar usuario, Resetear contraseña |

### 🔐 **UC6: Gestionar Permisos**
| Elemento | Descripción |
|----------|-------------|
| **Actor Principal** | Administrador |
| **Roles Disponibles** | Auditor, Analista, Administrador |

---

## 4. RESUMEN DE CASOS DE USO

| # | Caso de Uso | Actor | Entidad Principal | Estado |
|---|---|---|---|---|
| 1 | Gestionar Documentos | Auditor | Document | ✅ Implementado |
| 2 | Generar Reportes | Auditor | AuditLog | ✅ En desarrollo |
| 3 | Monitorear Cumplimiento | Auditor | Compliance | ✅ Implementado |
| 4 | Administrar Usuarios | Admin | User | ✅ Implementado |
| 5 | Configurar Sistema | Admin | Config | ✅ Implementado |
| 6 | Gestionar Permisos | Admin | Role | ✅ Implementado |
| 7 | **Analizar Cumplimiento con IA** | Analista | AIAnalysis | ✅ **NUEVO** |
| 8 | **Generar Resúmenes** | Analista | AISummary | ✅ **NUEVO** |
| 9 | **Identificar Brechas** | Analista | AIGaps | ✅ **NUEVO** |

**Total: 9 casos de uso principales**
- **6** casos legados del MVP
- **3** casos NUEVOS de IA (UC7, UC8, UC9)

---
