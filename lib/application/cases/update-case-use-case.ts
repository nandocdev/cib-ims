// lib/application/cases/update-case-use-case.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Caso de Uso: Actualización Técnica de Expediente con Reglas de Inmutabilidad y Auditoría

import { Case, UpdateCaseInput, UpdateCaseInputSchema } from '@/lib/domain/cases/case';
import { calculateRiskScore } from '@/lib/domain/risk/risk-calculator';
import { canActor } from '@/lib/domain/auth/role-permissions';
import { ICaseRepository } from '@/lib/infrastructure/repositories/case-repository.interface';
import { FirestoreAuditRepository } from '@/lib/infrastructure/repositories/firestore-audit-repository';
import { createChainedAuditEntry } from '@/lib/domain/audit/audit-entry';
import { logger } from '@/lib/observability/logger';

export interface UpdateCaseCommand {
  codigo: string;
  updates: UpdateCaseInput;
  reason?: string;
  actor: {
    id: string;
    email?: string;
    name: string;
    role: string;
    badgeNumber: string;
  };
}

export class UpdateCaseUseCase {
  constructor(
    private caseRepo: ICaseRepository,
    private auditRepo: FirestoreAuditRepository
  ) {}

  async execute(command: UpdateCaseCommand): Promise<Case> {
    const { codigo, updates, reason = 'Actualización técnica de datos de expediente', actor } = command;
    const normalizedCode = codigo.toUpperCase();

    // 1. Autorización
    if (!canActor(actor.role, 'case.update')) {
      throw new Error(
        `ACCESO DENEGADO: El rol [${actor.role}] no cuenta con el privilegio [case.update] para editar expedientes.`
      );
    }

    // 2. Localizar expediente actual
    const existing = await this.caseRepo.findByCode(normalizedCode);
    if (!existing) {
      throw new Error(`EXPEDIENTE NO ENCONTRADO: [${normalizedCode}].`);
    }

    // 3. Regla Fundamental de Inmutabilidad Forense:
    // Si el caso está en CERRADO, las modificaciones ordinarias quedan prohibidas (Ley 51 de 2008)
    if (existing.status === 'CERRADO') {
      throw new Error(
        `VIOLACIÓN DE CADENA DE CUSTODIA FORENSE: El expediente [${normalizedCode}] se encuentra CERRADO y sellado. Para efectuar modificaciones extraordinarias, debe tramitarse una reapertura formal autorizada por un Supervisor.`
      );
    }

    // 4. Validación de campos de actualización
    const validatedUpdates = UpdateCaseInputSchema.parse(updates);

    // 5. Recalcular Risk Score centralizado si cambiaron P o I
    const probability = validatedUpdates.probability ?? existing.probability;
    const impact = validatedUpdates.impact ?? existing.impact;
    const riskScore = calculateRiskScore(probability, impact);

    const mergedPayload: Partial<Case> = {
      ...validatedUpdates,
      probability,
      impact,
      riskScore,
      updatedAt: new Date().toISOString(),
    };

    // 6. Persistir
    const updated = await this.caseRepo.update(normalizedCode, mergedPayload);

    // 7. Auditoría Encadenada
    try {
      const prevHash = await this.auditRepo.getLatestHash(normalizedCode);
      const isRiskChanged = existing.riskScore !== riskScore;
      const action = isRiskChanged ? 'RISK_CHANGED' : 'CASE_UPDATED';

      const auditEntry = await createChainedAuditEntry({
        caseId: normalizedCode,
        actorId: actor.id || actor.badgeNumber,
        actorEmail: actor.email,
        actorName: actor.name,
        actorRole: actor.role,
        action,
        reason,
        previousState: {
          title: existing.title,
          probability: existing.probability,
          impact: existing.impact,
          riskScore: existing.riskScore,
          status: existing.status,
        },
        newState: {
          title: updated.title,
          probability: updated.probability,
          impact: updated.impact,
          riskScore: updated.riskScore,
          status: updated.status,
        },
        previousHash: prevHash,
        metadata: {
          updatedFields: Object.keys(validatedUpdates),
        },
      });

      await this.auditRepo.append(auditEntry);
    } catch (auditErr) {
      logger.error('Error al asentar auditoría para actualización de caso', { code: normalizedCode }, auditErr);
    }

    return updated;
  }
}
