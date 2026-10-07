// lib/application/cases/transition-case-status-use-case.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Caso de Uso: Control Formal del Ciclo de Vida del Expediente y Sellado Criptográfico

import { Case } from '@/lib/domain/cases/case';
import { CaseStatus, validateStatusTransition } from '@/lib/domain/cases/case-status';
import { ICaseRepository } from '@/lib/infrastructure/repositories/case-repository.interface';
import { FirestoreAuditRepository } from '@/lib/infrastructure/repositories/firestore-audit-repository';
import { createChainedAuditEntry, AuditAction } from '@/lib/domain/audit/audit-entry';
import { sha256Hex } from '@/lib/domain/crypto/hasher';
import { calculateRiskScore } from '@/lib/domain/risk/risk-calculator';
import { logger } from '@/lib/observability/logger';

export interface TransitionCaseStatusCommand {
  codigo: string;
  targetStatus: CaseStatus;
  reason: string;
  resolutionVerdict?: string;
  residualProbability?: number;
  residualImpact?: number;
  actor: {
    id: string;
    email?: string;
    name: string;
    role: string;
    badgeNumber: string;
  };
}

export class TransitionCaseStatusUseCase {
  constructor(
    private caseRepo: ICaseRepository,
    private auditRepo: FirestoreAuditRepository
  ) {}

  async execute(command: TransitionCaseStatusCommand): Promise<Case> {
    const { codigo, targetStatus, reason, resolutionVerdict, residualProbability, residualImpact, actor } = command;
    const normalizedCode = codigo.toUpperCase();

    // 1. Obtener expediente actual
    const existing = await this.caseRepo.findByCode(normalizedCode);
    if (!existing) {
      throw new Error(`EXPEDIENTE NO LOCALIZADO: [${normalizedCode}].`);
    }

    // 2. Validación formal mediante la Máquina de Estados de Dominio
    const transitionCheck = validateStatusTransition(existing.status, targetStatus, actor.role, reason);
    if (!transitionCheck.allowed) {
      logger.warn('Transición de estado de expediente rechazada', {
        code: normalizedCode,
        from: existing.status,
        to: targetStatus,
        error: transitionCheck.error,
      });
      throw new Error(transitionCheck.error || 'Transición de estado no autorizada.');
    }

    const now = new Date().toISOString();
    const updates: Partial<Case> = {
      status: targetStatus,
      updatedAt: now,
    };

    let auditAction: AuditAction = 'CASE_UPDATED';

    // 3. Lógica específica por estado objetivo
    if (targetStatus === 'CERRADO') {
      auditAction = 'CASE_CLOSED';
      updates.sealedAt = now;
      if (resolutionVerdict) {
        updates.resolutionVerdict = resolutionVerdict;
      }
      updates.resolvedByName = actor.name;
      updates.resolvedByBadge = actor.badgeNumber;

      if (residualProbability !== undefined && residualImpact !== undefined) {
        updates.residualProbability = residualProbability;
        updates.residualImpact = residualImpact;
        updates.residualRiskScore = calculateRiskScore(residualProbability, residualImpact);
      }

      // Generar sello de integridad SHA-256
      const sealContent = `${normalizedCode}|${actor.badgeNumber}|${now}|${resolutionVerdict || reason}`;
      updates.resolutionHash = await sha256Hex(sealContent);
    } else if (targetStatus === 'EN_AUDITORIA') {
      auditAction = 'CASE_SENT_TO_AUDIT';
    } else if (targetStatus === 'ABIERTO' && existing.status === 'CERRADO') {
      auditAction = 'CASE_REOPENED';
      updates.sealedAt = undefined;
      updates.resolutionHash = undefined;
    }

    // 4. Persistir actualización en repositorio
    const updated = await this.caseRepo.update(normalizedCode, updates);

    // 5. Asentar evento de auditoría con hash encadenado
    try {
      const prevHash = await this.auditRepo.getLatestHash(normalizedCode);
      const auditEntry = await createChainedAuditEntry({
        caseId: normalizedCode,
        actorId: actor.id || actor.badgeNumber,
        actorEmail: actor.email,
        actorName: actor.name,
        actorRole: actor.role,
        action: auditAction,
        reason,
        previousState: { status: existing.status, sealedAt: existing.sealedAt || null },
        newState: { status: updated.status, sealedAt: updated.sealedAt || null, resolutionHash: updated.resolutionHash || null },
        previousHash: prevHash,
        metadata: {
          transition: `${existing.status} -> ${targetStatus}`,
          resolutionHash: updated.resolutionHash,
        },
      });
      await this.auditRepo.append(auditEntry);
    } catch (auditErr) {
      logger.error('Error al asentar auditoría para cambio de estado', { code: normalizedCode }, auditErr);
    }

    return updated;
  }
}
