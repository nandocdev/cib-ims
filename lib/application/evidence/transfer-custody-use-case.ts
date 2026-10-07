// lib/application/evidence/transfer-custody-use-case.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Caso de Uso: Traspaso Formal de Cadena de Custodia de Evidencia Digital

import { canActor } from '@/lib/domain/auth/role-permissions';
import { createCustodyTransferEvent, CustodyEvent, CustodyEventAction } from '@/lib/domain/evidence/evidence';
import { FirestoreAuditRepository } from '@/lib/infrastructure/repositories/firestore-audit-repository';
import { createChainedAuditEntry } from '@/lib/domain/audit/audit-entry';
import { ICaseRepository } from '@/lib/infrastructure/repositories/case-repository.interface';
import { logger } from '@/lib/observability/logger';

export interface TransferCustodyCommand {
  caseCode: string;
  evidenceCode: string;
  action: CustodyEventAction;
  fromUser: string;
  fromUserBadge: string;
  toUser: string;
  toUserBadge: string;
  reason: string;
  location: string;
  actor: {
    id: string;
    email?: string;
    name: string;
    role: string;
    badgeNumber: string;
  };
}

export class TransferCustodyUseCase {
  constructor(
    private caseRepo: ICaseRepository,
    private auditRepo: FirestoreAuditRepository
  ) {}

  async execute(command: TransferCustodyCommand): Promise<CustodyEvent> {
    const { caseCode, evidenceCode, action, fromUser, fromUserBadge, toUser, toUserBadge, reason, location, actor } = command;
    const normalizedCaseCode = caseCode.toUpperCase();

    // 1. Autorización
    if (!canActor(actor.role, 'evidence.transfer')) {
      throw new Error(`ACCESO DENEGADO: El rol [${actor.role}] no posee el privilegio [evidence.transfer].`);
    }

    // 2. Verificar existencia del caso y de la evidencia
    const caseEntity = await this.caseRepo.findByCode(normalizedCaseCode);
    if (!caseEntity) {
      throw new Error(`EXPEDIENTE NO ENCONTRADO: [${normalizedCaseCode}].`);
    }

    const evidenceList = caseEntity.evidence || [];
    const evIndex = evidenceList.findIndex((e) => e.evidenceCode.toUpperCase() === evidenceCode.toUpperCase());

    if (evIndex === -1) {
      throw new Error(`ARTEFACTO DE EVIDENCIA NO ENCONTRADO: [${evidenceCode}] en expediente [${normalizedCaseCode}].`);
    }

    // 3. Crear el evento de cadena de custodia con hash encadenado
    const custodyEvent = await createCustodyTransferEvent({
      evidenceId: evidenceList[evIndex].id,
      caseId: normalizedCaseCode,
      action,
      fromUser,
      fromUserBadge,
      toUser,
      toUserBadge,
      reason,
      location,
    });

    // 4. Actualizar custodio actual de la evidencia en el expediente
    evidenceList[evIndex] = {
      ...evidenceList[evIndex],
      chainOfCustodyCustodian: `${toUser} (${toUserBadge})`,
      extractionLocation: location,
    };

    await this.caseRepo.update(normalizedCaseCode, {
      evidence: evidenceList,
    });

    // 5. Asentar evento en el log de auditoría
    try {
      const prevHash = await this.auditRepo.getLatestHash(normalizedCaseCode);
      const auditEntry = await createChainedAuditEntry({
        caseId: normalizedCaseCode,
        actorId: actor.id || actor.badgeNumber,
        actorEmail: actor.email,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'EVIDENCE_TRANSFERRED',
        reason: `Traspaso de custodia de ${evidenceCode}: de ${fromUserBadge} a ${toUserBadge}. Motivo: ${reason}`,
        previousHash: prevHash,
        metadata: {
          evidenceCode,
          custodyId: custodyEvent.custodyId,
          custodyHash: custodyEvent.currentHash,
          location,
        },
      });
      await this.auditRepo.append(auditEntry);
    } catch (auditErr) {
      logger.error('Error al asentar auditoría para traspaso de custodia', { caseCode: normalizedCaseCode }, auditErr);
    }

    return custodyEvent;
  }
}
