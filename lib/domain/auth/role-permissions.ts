// lib/domain/auth/role-permissions.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Matriz de Control de Acceso Basada en Roles (RBAC) y Evaluación de Privilegios

import { SystemRole, InstitutionalRole, INSTITUTIONAL_TO_SYSTEM_ROLE } from './roles';
import { Permission } from './permissions';

export const ROLE_PERMISSIONS: Record<SystemRole, readonly Permission[]> = {
  ADMIN: [
    'case.read',
    'case.create',
    'case.update',
    'case.audit',
    'case.close',
    'case.reopen',
    'evidence.read',
    'evidence.create',
    'evidence.update',
    'evidence.transfer',
    'investigation.read',
    'investigation.update',
    'audit.read',
    'user.manage',
    'legal.read',
    'legal.manage',
    'system.seed',
    'system.configure',
  ],
  SUPERVISOR: [
    'case.read',
    'case.create',
    'case.update',
    'case.audit',
    'case.close',
    'case.reopen',
    'evidence.read',
    'evidence.create',
    'evidence.update',
    'evidence.transfer',
    'investigation.read',
    'investigation.update',
    'audit.read',
    'legal.read',
  ],
  INVESTIGATOR: [
    'case.read',
    'case.create',
    'case.update',
    'evidence.read',
    'evidence.create',
    'evidence.update',
    'evidence.transfer',
    'investigation.read',
    'investigation.update',
    'audit.read',
    'legal.read',
  ],
  AUDITOR: [
    'case.read',
    'case.audit',
    'evidence.read',
    'investigation.read',
    'audit.read',
    'legal.read',
  ],
  LEGAL: [
    'case.read',
    'evidence.read',
    'audit.read',
    'legal.read',
    'legal.manage',
  ],
  ANALYST: [
    'case.read',
    'case.update',
    'evidence.read',
    'investigation.read',
    'audit.read',
    'legal.read',
  ],
  VIEWER: [
    'case.read',
    'evidence.read',
    'investigation.read',
    'legal.read',
  ],
};

/**
 * Evalúa si un rol del sistema posee un permiso específico
 */
export function hasPermission(role: SystemRole | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return Boolean(permissions && permissions.includes(permission));
}

/**
 * Normaliza y evalúa permisos tanto para SystemRole como para InstitutionalRole legado
 */
export function canActor(roleOrInstitutionalRole: string | undefined | null, permission: Permission): boolean {
  if (!roleOrInstitutionalRole) return false;
  // Si ya es un SystemRole válido:
  if (roleOrInstitutionalRole in ROLE_PERMISSIONS) {
    return hasPermission(roleOrInstitutionalRole as SystemRole, permission);
  }
  // Si es un rol institucional legado:
  if (roleOrInstitutionalRole in INSTITUTIONAL_TO_SYSTEM_ROLE) {
    const sysRole = INSTITUTIONAL_TO_SYSTEM_ROLE[roleOrInstitutionalRole as InstitutionalRole];
    return hasPermission(sysRole, permission);
  }
  return false;
}
