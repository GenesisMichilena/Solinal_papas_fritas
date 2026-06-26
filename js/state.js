// BASE DE DATOS EN MEMORIA (REACTIVA Y ACTUALIZABLE)
window.state = {
  documents: [
    { code: 'PRO-CAL-009', title: 'Control de Calidad Producto Terminado', type: 'Procedimiento', norma: 'ISO 9001:2015', estado: 'Borrador', version: 'v1.2', creador: 'Ana Torres', vencido: false, critico: false, content: '1. Alcance: Definir los criterios de calidad para la liberación de producto terminado en la planta de papas fritas.\n2. Responsabilidades: El jefe de calidad es responsable de realizar los muestreos.\n3. Desarrollo: Inspección organoléptica, medición de humedad (máx 2%) y control de sellado de bolsas.\n4. Control de registros: Formato REG-CAL-015 guardado en servidor por 3 años.\n5. Firmas: Elaborado por Ana Torres.', signatures: [], revisiones: ['v1.1: Ajustes en límites de humedad', 'v1.0: Carga inicial de procedimiento'] },
    { code: 'POL-GER-003', title: 'Política de Inocuidad Alimentaria', type: 'Política', norma: 'ISO 22000:2018', estado: 'En aprobación', version: 'v2.0', creador: 'Erick Murillo', vencido: false, critico: true, content: '1. Objetivo: Establecer el compromiso de Solinal S.A. con la inocuidad y cumplimiento normativo.\n2. Alcance: Aplicable a todo el personal de planta y administración.\n3. Declaración de Política: Elaborar alimentos seguros siguiendo los estándares HACCP e ISO 22000.\n4. Revisión: Anual por la gerencia.', signatures: ['Erick Murillo'], revisiones: ['v1.0: Emisión inicial aprobada en 2024'] },
    { code: 'MAN-CAL-001', title: 'Manual del SGC', type: 'Manual', norma: 'ISO 9001:2015', estado: 'Aprobado', version: 'v3.1', creador: 'Erick Murillo', vencido: false, critico: true, content: '1. Alcance: Sistema de Gestión de Calidad para la producción de papas fritas.\n2. Exclusiones: Ninguna.\n3. Procesos Clave: Recepción de papa, pelado, corte, fritura, empacado y despacho.\n4. Política de Calidad integrada.', signatures: ['Erick Murillo', 'Carlos Ruiz'], revisiones: ['v3.0: Adecuación a nueva estructura', 'v2.0: Revisión bienal'] },
    { code: 'INS-PRO-012', title: 'Instructivo de Limpieza CIP', type: 'Instructivo', norma: 'ISO 22000:2018', estado: 'Rechazado', version: 'v1.0', creador: 'Ana Torres', vencido: false, critico: false, content: '1. Preparación: Apagar línea de fritura y purgar remanente de aceite.\n2. Lavado cáustico: Circular solución de NaOH al 1.5% a 75°C durante 20 minutes.\n3. Enjuague: Con agua potable hasta pH neutro.\n4. Registro: Anotar en bitácora de limpieza.', signatures: [], revisiones: [] },
    { code: 'CHK-HAC-001', title: 'Checklist Control de Alérgenos', type: 'Checklist', norma: 'ISO 22000:2018', estado: 'Aprobado', version: 'v1.5', creador: 'Nicolas Fiallo', vencido: true, critico: false, content: '1. Verificación de limpieza de línea tras procesar papas con sabor a queso.\n2. Inspección visual de residuos de polvo sazonador.\n3. Prueba rápida de flujo lateral para alérgenos de leche.\n4. Liberación de línea por supervisor.', signatures: ['Nicolas Fiallo'], revisiones: ['v1.4: Actualización de kit de prueba rápida'] },
    { code: 'REG-AMB-002', title: 'Registro de Residuos Sólidos', type: 'Instructivo', norma: 'ISO 14001:2015', estado: 'Aprobado', version: 'v1.0', creador: 'Nicolas Fiallo', vencido: true, critico: false, content: '1. Objetivo: Registrar la cantidad de residuos orgánicos e inorgánicos generados diariamente.\n2. Disposición: Desechos de papa a compostaje; empaques plásticos a reciclaje.', signatures: ['Nicolas Fiallo'], revisiones: [] },
    { code: 'PRO-SEG-005', title: 'Procedimiento de Trazabilidad y Retiro', type: 'Procedimiento', norma: 'ISO 22000:2018', estado: 'Aprobado', version: 'v2.1', creador: 'Carlos Ruiz', vencido: true, critico: true, content: '1. Alcance: Trazabilidad de materia prima (papa, aceite, sazonador) hasta cliente final.\n2. Simulacro de retiro: Dos veces al año, meta de efectividad 98% en 4 horas.', signatures: ['Carlos Ruiz'], revisiones: ['v2.0: Ajuste de tiempos de retiro'] }
  ],
  templates: [
    { key: 'procedimiento', name: 'Procedimiento ISO 9001', norma: 'ISO 9001:2015', type: 'Procedimiento', desc: 'Estructura con alcance, responsabilidades, control de cambios y registros.', preview: 'Incluye alcance, responsables, registros y control de cambios.', content: '1. Alcance\n2. Responsabilidades\n3. Recursos y controles\n4. Registro de calidad\n5. Control de cambios', mandatory: ['Alcance', 'Responsabilidades'] },
    { key: 'politica', name: 'Política de Calidad', norma: 'ISO 9001:2015', type: 'Política', desc: 'Documento maestro con firma obligatoria y revisión anual.', preview: 'Incluye firma obligatoria, revisión anual y autoridad responsable.', content: '1. Objetivo\n2. Alcance\n3. Declaración de política\n4. Responsabilidades\n5. Revisión y firma', mandatory: ['Declaración de política', 'Firma'] },
    { key: 'checklist', name: 'Checklist HACCP', norma: 'ISO 22000:2018', type: 'Checklist', desc: 'Formato verificable con alérgenos y responsables.', preview: 'Incluye puntos de control, evidencia y responsables de verificación.', content: '1. Inspección de calidad\n2. Verificación de temperatura\n3. Confirmación de proveedores\n4. Registro de no conformidades', mandatory: ['Puntos de control'] },
    { key: 'instructivo', name: 'Instructivo de Limpieza', norma: 'ISO 22000:2018', type: 'Instructivo', desc: 'Guía paso a paso para control de higiene y actividades operativas.', preview: 'Incluye pasos, herramientas necesarias y evidencia de control.', content: '1. Preparación\n2. Enjuague inicial\n3. Aplicación de detergente\n4. Enjuague final\n5. Verificación de limpieza', mandatory: ['Pasos de limpieza'] }
  ],
  auditLogs: [
    { id: 1, action: 'Documento POL-GER-003 aprobado', user: 'Carlos Ruiz', role: 'Aprobador', date: '2026-06-20', time: '09:14', ip: '190.45.23.10' },
    { id: 2, action: 'Documento INS-PRO-012 rechazado', user: 'Ana Torres', role: 'Revisor', date: '2026-06-19', time: '16:08', ip: '190.45.23.82' },
    { id: 3, action: 'Usuario añadido al sistema (Ana Torres)', user: 'Erick Murillo', role: 'Administrador', date: '2026-06-17', time: '11:42', ip: '190.45.23.66' },
    { id: 4, action: 'Documento MAN-CAL-001 restaurado a v3.1', user: 'Erick Murillo', role: 'Administrador', date: '2026-06-17', time: '10:05', ip: '190.45.23.66' }
  ],
  comments: [
    { code: 'PRO-CAL-009', author: 'Ana Torres', date: '2026-06-21 00:30', text: '¿Se requiere agregar la firma del director de planta aquí?' },
    { code: 'POL-GER-003', author: 'Carlos Ruiz', date: '2026-06-20 18:45', text: 'Esta política debe ser difundida a todos los colaboradores antes de fin de mes.' }
  ],
  users: [
    { name: 'Erick Murillo', short: 'EM', role: 'Administrador' },
    { name: 'Nicolas Fiallo', short: 'NF', role: 'Elaborador' },
    { name: 'Ana Torres', short: 'AT', role: 'Revisor' },
    { name: 'Carlos Ruiz', short: 'CR', role: 'Aprobador' },
    { name: 'Lector Simulado', short: 'LS', role: 'Lector' }
  ],
  
  // Variables de config
  activeRole: 'Administrador',
  activeUser: 'Erick Murillo',
  roleIndex: 0,
  isLocked: false,
  failedAttempts: 0,
  twoFactorEnabled: false,
  passwordPolicy: 'strong',
  doubleApproval: 'critical',
  orgName: 'Solinal S.A.',
  brandColor: '#1B4F8A',

  // Editor Activo State
  activeDocCode: 'PRO-CAL-009',
  isSectionLocked: false
};

window.pages = ['dash','docs','edit','comp','templates','audit','users','config'];

// LOG AUDIT ACTION GLOBAL
window.logAuditAction = function(actionText) {
  const newLog = {
    id: window.state.auditLogs.length + 1,
    action: actionText,
    user: window.state.activeUser,
    role: window.state.activeRole,
    date: new Date().toISOString().slice(0,10),
    time: new Date().toTimeString().slice(0,5),
    ip: '192.168.1.' + Math.floor(Math.random() * 254 + 1)
  };
  window.state.auditLogs.unshift(newLog);
  if (typeof renderAuditTrail === 'function') renderAuditTrail();
  if (typeof populateAuditFilters === 'function') populateAuditFilters();
};
