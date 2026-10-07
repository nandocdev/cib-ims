// lib/domain/cases/case-status.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Máquina Formal de Estados del Expediente Forense y Validación de Transiciones

import { z } from 'zod';
import { Permission } from '../auth/permissions';
import { canActor } from '../auth/role-permissions';

export const CaseStatusSchema = z.enum(['ABIERTO', 'EN_AUDITORIA', 'CERRADO']);
export type CaseStatus = z.infer<typeof CaseStatusSchema>;

export interface StateTransitionRule {
  from: CaseStatus;
  to: CaseStatus;
  requiredPermission: Permission;
  requiresReason: boolean;
  description: string;
}

export const VALID_TRANSITIONS: readonly StateTransitionRule[] = [
  {
    from: 'ABIERTO',
    to: 'EN_AUDITORIA',
    requiredPermission: 'case.audit',
    requiresReason: true,
    description: 'Pase a auditoría normativa y control de garantías forenses',
  },
  {
    from: 'EN_AUDITORIA',
    to: 'CERRADO',
    requiredPermission: 'case.close',
    requiresReason: true,
    description: 'Sellado definitivo de cadena de custodia y dictamen final',
  },
  {
    from: 'ABIERTO',
    to: 'CERRADO',
    requiredPermission: 'case.close',
    requiresReason: true,
    description: 'Cierre directo con dictamen final de remediación verificado',
  },
  {
    from: 'EN_AUDITORIA',
    to: 'ABIERTO',
    requiredPermission: 'case.update',
    requiresReason: true,
    description: 'Rechazo u observaciones en auditoría que requieren diligencias adicionales',
  },
  {
    from: 'CERRADO',
    to: 'ABIERTO',
    requiredPermission: 'case.reopen',
    requiresReason: true,
    description: 'Reapertura excepcional por hechos sobrevinientes autorizada por Supervisor',
  },
] as const;

export interface TransitionValidationResult {
  allowed: boolean;
  error?: string;
  rule?: StateTransitionRule;
}

/**
 * Valida de forma estricta si una transición de estado es jurídicamente y operativamente admisible
 */
export function validateStatusTransition(
  currentStatus: CaseStatus,
  targetStatus: CaseStatus,
  actorRole: string | undefined | null,
  reason?: string
): TransitionValidationResult {
  // Transición sin cambios (noop)
  if (currentStatus === targetStatus) {
    return { allowed: true };
  }

  const rule = VALID_TRANSITIONS.find((t) => t.from === currentStatus && t.to === targetStatus);

  if (!rule) {
    return {
      allowed: false,
      error: `Transición de estado inválida: No está permitido pasar de [${currentStatus}] a [${targetStatus}].`,
    };
  }

  // Validación de permiso del actor
  if (!canActor(actorRole, rule.requiredPermission)) {
    return {
      allowed: false,
      error: `Permiso insuficiente: El rol [${actorRole || 'ANON'}] no posee el privilegio [${rule.requiredPermission}] requerido para ${rule.description.toLowerCase()}.`,
    };
  }

  // Validación de justificación obligatoria
  if (rule.requiresReason && (!reason || reason.trim().length < 5)) {
    return {
      allowed: false,
      error: `Motivación obligatoria: La transición de [${currentStatus}] a [${targetStatus}] exige consignar un motivo justificado mínimo de 5 caracteres.`,
    };
  }

  return { allowed: true, rule };
}
