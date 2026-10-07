// lib/domain/audit/audit-entry.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Dominio de Auditoría Forense Inmutable y Trazabilidad Encadenada

import { z } from 'zod';
import { computeChainedHash, GENESIS_HASH } from '../crypto/hasher';

export const AuditActionSchema = z.enum([
  'CASE_CREATED',
  'CASE_UPDATED',
  'CASE_SENT_TO_AUDIT',
  'CASE_AUDITED',
  'CASE_CLOSED',
  'CASE_REOPENED',
  'EVIDENCE_ADDED',
  'EVIDENCE_UPDATED',
  'EVIDENCE_TRANSFERRED',
  'RISK_CHANGED',
  'CLASSIFICATION_CHANGED',
  'MITIGATION_ADDED',
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'PERMISSION_DENIED',
]);
export type AuditAction = z.infer<typeof AuditActionSchema>;

export const AuditEntrySchema = z.object({
  auditId: z.string().min(1),
  caseId: z.string().min(1),
  actorId: z.string().min(1),
  actorEmail: z.string().email().optional(),
  actorName: z.string().min(1),
  actorRole: z.string().min(1),
  action: AuditActionSchema,
  timestamp: z.string().datetime(),
  previousState: z.record(z.string(), z.unknown()).nullable().optional(),
  newState: z.record(z.string(), z.unknown()).nullable().optional(),
  reason: z.string().min(3),
  metadata: z.record(z.string(), z.unknown()).default({}),
  previousHash: z.string().regex(/^[a-fA-F0-9]{64}$/),
  currentHash: z.string().regex(/^[a-fA-F0-9]{64}$/),
});
export type AuditEntry = z.infer<typeof AuditEntrySchema>;

/**
 * Fabrica una entrada de auditoría con sello criptográfico encadenado
 */
export async function createChainedAuditEntry(params: {
  caseId: string;
  actorId: string;
  actorEmail?: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  reason: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  previousHash?: string;
}): Promise<AuditEntry> {
  const timestamp = new Date().toISOString();
  const prevHash = params.previousHash || GENESIS_HASH;

  const canonicalPayload = {
    caseId: params.caseId,
    actorId: params.actorId,
    action: params.action,
    reason: params.reason,
    previousState: params.previousState || null,
    newState: params.newState || null,
    metadata: params.metadata || {},
  };

  const currentHash = await computeChainedHash({
    previousHash: prevHash,
    canonicalEventData: canonicalPayload,
    timestamp,
    actorId: params.actorId,
    action: params.action,
  });

  return {
    auditId: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    caseId: params.caseId,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    actorName: params.actorName,
    actorRole: params.actorRole,
    action: params.action,
    timestamp,
    previousState: params.previousState || null,
    newState: params.newState || null,
    reason: params.reason,
    metadata: params.metadata || {},
    previousHash: prevHash,
    currentHash,
  };
}
