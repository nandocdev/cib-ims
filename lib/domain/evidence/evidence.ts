// lib/domain/evidence/evidence.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Dominio de Evidencia Digital y Cadena de Custodia Formal (Ley 51 de 2008)

import { z } from 'zod';
import { computeChainedHash, GENESIS_HASH } from '../crypto/hasher';

export const EvidenceStatusSchema = z.enum([
  'COLLECTED',    // Incautada y preservada
  'ANALYZED',     // Bajo peritaje en laboratorio
  'TRANSFERRED',  // En tránsito o traspaso de custodia
  'STORED',       // En bodega de evidencias
  'PRESENTED',    // Presentada ante el tribunal / fiscalía
  'DISPOSED',     // Destrucción certificada
]);
export type EvidenceStatus = z.infer<typeof EvidenceStatusSchema>;

export const CustodyEventActionSchema = z.enum([
  'INITIAL_COLLECTION',
  'CUSTODY_TRANSFER',
  'LAB_ANALYSIS_CHECKOUT',
  'LAB_ANALYSIS_RETURN',
  'SECURE_STORAGE_DEPOSIT',
  'JUDICIAL_PRESENTATION',
  'DISPOSAL_DESTRUCTION',
]);
export type CustodyEventAction = z.infer<typeof CustodyEventActionSchema>;

// Evento Individual de Cadena de Custodia
export const CustodyEventSchema = z.object({
  custodyId: z.string().min(1),
  evidenceId: z.string().min(1),
  caseId: z.string().min(1),
  action: CustodyEventActionSchema,
  fromUser: z.string().min(2),
  fromUserBadge: z.string().min(2),
  toUser: z.string().min(2),
  toUserBadge: z.string().min(2),
  timestamp: z.string().datetime(),
  reason: z.string().min(5),
  location: z.string().min(3),
  previousHash: z.string().regex(/^[a-fA-F0-9]{64}$/),
  currentHash: z.string().regex(/^[a-fA-F0-9]{64}$/),
  verificationNotes: z.string().optional(),
});
export type CustodyEvent = z.infer<typeof CustodyEventSchema>;

// Entidad Principal de Evidencia Digital
export const DigitalEvidenceSchema = z.object({
  evidenceId: z.string().min(1),
  caseId: z.string().min(1),
  evidenceCode: z.string().regex(/^EV-\d{4}-\d{3}-[A-Z0-9]+$/),
  name: z.string().min(3),
  description: z.string().min(5),
  type: z.string().min(2),
  fileSize: z.string().min(1),
  hash: z.string().regex(/^[a-fA-F0-9]{64}$/),
  hashAlgorithm: z.enum(['SHA-256', 'SHA-512', 'BLAKE3']).default('SHA-256'),
  createdAt: z.string().datetime(),
  createdBy: z.string().min(2),
  currentCustodian: z.string().min(2),
  currentCustodianBadge: z.string().min(2),
  storageLocation: z.string().min(3),
  status: EvidenceStatusSchema,
  isCompromised: z.boolean().default(false),
  chainOfCustody: z.array(CustodyEventSchema).default([]),
});
export type DigitalEvidence = z.infer<typeof DigitalEvidenceSchema>;

/**
 * Crea un evento de traspaso de custodia con hash encadenado estricto
 */
export async function createCustodyTransferEvent(params: {
  evidenceId: string;
  caseId: string;
  action: CustodyEventAction;
  fromUser: string;
  fromUserBadge: string;
  toUser: string;
  toUserBadge: string;
  reason: string;
  location: string;
  previousHash?: string;
}): Promise<CustodyEvent> {
  const timestamp = new Date().toISOString();
  const prevHash = params.previousHash || GENESIS_HASH;

  const eventPayload = {
    evidenceId: params.evidenceId,
    caseId: params.caseId,
    action: params.action,
    fromUser: params.fromUser,
    toUser: params.toUser,
    reason: params.reason,
    location: params.location,
  };

  const currentHash = await computeChainedHash({
    previousHash: prevHash,
    canonicalEventData: eventPayload,
    timestamp,
    actorId: params.fromUserBadge,
    action: params.action,
  });

  return {
    custodyId: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    evidenceId: params.evidenceId,
    caseId: params.caseId,
    action: params.action,
    fromUser: params.fromUser,
    fromUserBadge: params.fromUserBadge,
    toUser: params.toUser,
    toUserBadge: params.toUserBadge,
    timestamp,
    reason: params.reason,
    location: params.location,
    previousHash: prevHash,
    currentHash,
  };
}
