// lib/domain/auth/roles.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Definición Formal de Roles del Sistema y Mapeo Institucional

export type SystemRole =
  | 'ADMIN'
  | 'SUPERVISOR'
  | 'INVESTIGATOR'
  | 'AUDITOR'
  | 'LEGAL'
  | 'ANALYST'
  | 'VIEWER';

export type InstitutionalRole =
  | 'COMISIONADO_DIRECTOR'
  | 'AGENTE_FORENSE_TECNICO'
  | 'AUDITOR_LEGAL_NORMATIVO'
  | 'ANALISTA_DE_RIESGO'
  | 'OBSERVADOR_CADETE';

/**
 * Mapeo canónico entre roles institucionales de carrera y roles de seguridad del sistema
 */
export const INSTITUTIONAL_TO_SYSTEM_ROLE: Record<InstitutionalRole, SystemRole> = {
  COMISIONADO_DIRECTOR: 'ADMIN',
  AGENTE_FORENSE_TECNICO: 'INVESTIGATOR',
  AUDITOR_LEGAL_NORMATIVO: 'AUDITOR',
  ANALISTA_DE_RIESGO: 'ANALYST',
  OBSERVADOR_CADETE: 'VIEWER',
};

export const SYSTEM_ROLE_LABELS: Record<SystemRole, string> = {
  ADMIN: 'Administrador / Director',
  SUPERVISOR: 'Supervisor de Investigaciones',
  INVESTIGATOR: 'Perito Forense Técnico',
  AUDITOR: 'Auditor de Cadena de Custodia',
  LEGAL: 'Asesor Legal y Normativo',
  ANALYST: 'Analista de Riesgo Táctico',
  VIEWER: 'Observador / Cadete',
};
