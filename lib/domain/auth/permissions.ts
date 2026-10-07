// lib/domain/auth/permissions.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Catálogo Exhaustivo de Permisos Granulares del Sistema CIB-IMS

export type Permission =
  // Gestión de Expedientes (Cases)
  | 'case.read'
  | 'case.create'
  | 'case.update'
  | 'case.audit'
  | 'case.close'
  | 'case.reopen'

  // Cadena de Custodia y Evidencia Digital
  | 'evidence.read'
  | 'evidence.create'
  | 'evidence.update'
  | 'evidence.transfer'

  // Investigación Forense y Bitácora
  | 'investigation.read'
  | 'investigation.update'

  // Auditoría y Trazabilidad Inmutable
  | 'audit.read'

  // Gestión de Usuarios y Roles
  | 'user.manage'

  // Cumplimiento Legal y Jurisprudencia
  | 'legal.read'
  | 'legal.manage'

  // Administración del Sistema
  | 'system.seed'
  | 'system.configure';
