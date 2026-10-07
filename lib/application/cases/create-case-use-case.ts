// lib/application/cases/create-case-use-case.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Caso de Uso: Alta y Registro Formal de Nuevo Incidente Forense

import { Case, CreateCaseInput, CreateCaseInputSchema } from '@/lib/domain/cases/case';
import { calculateRiskScore } from '@/lib/domain/risk/risk-calculator';
import { canActor } from '@/lib/domain/auth/role-permissions';
import { ICaseRepository } from '@/lib/infrastructure/repositories/case-repository.interface';
import { FirestoreAuditRepository } from '@/lib/infrastructure/repositories/firestore-audit-repository';
import { createChainedAuditEntry } from '@/lib/domain/audit/audit-entry';
import { logger } from '@/lib/observability/logger';

export interface CreateCaseCommand {
  input: CreateCaseInput;
  actor: {
    id: string;
    email?: string;
    name: string;
    role: string;
    badgeNumber: string;
  };
}

export class CreateCaseUseCase {
  constructor(
    private caseRepo: ICaseRepository,
    private auditRepo: FirestoreAuditRepository
  ) {}

  async execute(command: CreateCaseCommand): Promise<Case> {
    const { input, actor } = command;

    // 1. Autorización a nivel de aplicación
    if (!canActor(actor.role, 'case.create')) {
      logger.warn('Intento no autorizado de creación de expediente', { actor });
      throw new Error(
        `ACCESO DENEGADO: El rol [${actor.role}] no cuenta con el privilegio [case.create] para radicar nuevos expedientes.`
      );
    }

    // 2. Validación de Entrada (Zod)
    const validatedInput = CreateCaseInputSchema.parse(input);
    const normalizedCode = validatedInput.codigo.toUpperCase();

    // 3. Regla de Negocio: Código Institucional Único
    const exists = await this.caseRepo.existsByCode(normalizedCode);
    if (exists) {
      throw new Error(`CONFLICTO: El código pericial institucional [${normalizedCode}] ya se encuentra registrado.`);
    }

    // 4. Regla de Negocio: Derivación Centralizada del Riesgo (PxI)
    const riskScore = calculateRiskScore(validatedInput.probability, validatedInput.impact);
    const now = new Date().toISOString();

    const newCase: Case = {
      ...validatedInput,
      id: `case-${Date.now()}`,
      codigo: normalizedCode,
      status: 'ABIERTO', // Todo nuevo expediente inicia mandatoriamente en ABIERTO
      riskScore,
      detectedAt: validatedInput.detectedAt || now,
      updatedAt: now,
      evidenceCount: validatedInput.evidence?.length || 0,
      daysLoggedCount: validatedInput.timeline?.length || 0,
    };

    // 5. Persistencia del Expediente
    const created = await this.caseRepo.create(newCase);

    // 6. Generación de Registro de Auditoría con Hash Encadenado
    try {
      const prevHash = await this.auditRepo.getLatestHash(normalizedCode);
      const auditEntry = await createChainedAuditEntry({
        caseId: normalizedCode,
        actorId: actor.id || actor.badgeNumber,
        actorEmail: actor.email,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'CASE_CREATED',
        reason: 'Radicación inicial de incidente forense en sistema',
        newState: created as unknown as Record<string, unknown>,
        previousHash: prevHash,
        metadata: {
          operationCodename: created.operationCodename,
          initialRisk: created.riskScore,
          classification: created.classification,
        },
      });
      await this.auditRepo.append(auditEntry);
    } catch (auditErr) {
      logger.error('Error al asentar auditoría para nuevo expediente', { code: normalizedCode }, auditErr);
    }

    return created;
  }
}
