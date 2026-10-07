// lib/case-service.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Capa de Fachada de Aplicación (Application Façade) orientada a la arquitectura modular de dominios

import { Case, CreateCaseInput, UpdateCaseInput } from '@/lib/domain/cases/case';
import { Regulation } from '@/types/cib';
import { caseRepository } from '@/lib/infrastructure/repositories/firestore-case-repository';
import { auditRepository } from '@/lib/infrastructure/repositories/firestore-audit-repository';
import { regulationRepository } from '@/lib/infrastructure/repositories/firestore-regulation-repository';
import { CreateCaseUseCase } from '@/lib/application/cases/create-case-use-case';
import { UpdateCaseUseCase } from '@/lib/application/cases/update-case-use-case';
import { TransitionCaseStatusUseCase } from '@/lib/application/cases/transition-case-status-use-case';
import { INITIAL_CASES } from '@/lib/data/initial-cases';
import { INITIAL_REGULATIONS } from '@/lib/data/initial-data';
import { logger } from '@/lib/observability/logger';

// Instancias de Casos de Uso
const createCaseUseCase = new CreateCaseUseCase(caseRepository, auditRepository);
const updateCaseUseCase = new UpdateCaseUseCase(caseRepository, auditRepository);
const transitionCaseStatusUseCase = new TransitionCaseStatusUseCase(caseRepository, auditRepository);

/**
 * Consulta de todos los casos desde el repositorio oficial
 */
export async function getAllCases(): Promise<Case[]> {
  try {
    return await caseRepository.findAll();
  } catch (err) {
    logger.error('Error en getAllCases', undefined, err);
    return INITIAL_CASES;
  }
}

/**
 * Consulta de un caso específico por su código institucional
 */
export async function getCaseByCode(codigo: string): Promise<Case | null> {
  try {
    return await caseRepository.findByCode(codigo);
  } catch (err) {
    logger.error(`Error en getCaseByCode [${codigo}]`, { codigo }, err);
    return null;
  }
}

/**
 * Actualización técnica de expediente delegada a casos de uso de dominio
 */
export async function updateCaseByCode(
  codigo: string,
  updatedFields: Partial<Case>,
  userRole?: string
): Promise<{ success: boolean; case: Case; message?: string }> {
  const current = await caseRepository.findByCode(codigo);
  if (!current) {
    throw new Error(`Expediente [${codigo}] no fue localizado en los registros del CIB.`);
  }

  const actorRole = userRole || 'INVESTIGATOR';
  const actor = {
    id: current.leadInvestigatorBadge,
    name: current.leadInvestigatorName,
    role: actorRole,
    badgeNumber: current.leadInvestigatorBadge,
    email: current.leadInvestigatorEmail,
  };

  // Si se solicita una transición de estado (ej: CERRADO o EN_AUDITORIA), utilizar la máquina de estados
  if (updatedFields.status && updatedFields.status !== current.status) {
    const updated = await transitionCaseStatusUseCase.execute({
      codigo,
      targetStatus: updatedFields.status,
      reason: updatedFields.resolutionVerdict || 'Transición de estado formal aprobada',
      resolutionVerdict: updatedFields.resolutionVerdict,
      residualProbability: updatedFields.residualProbability,
      residualImpact: updatedFields.residualImpact,
      actor,
    });

    return {
      success: true,
      case: updated,
      message: `Expediente ${codigo} transicionado exitosamente a estado [${updated.status}].`,
    };
  }

  // Actualización regular de campos
  const { id, codigo: _c, ...cleanUpdates } = updatedFields as any;
  const updated = await updateCaseUseCase.execute({
    codigo,
    updates: cleanUpdates,
    reason: 'Actualización técnica de parámetros de caso',
    actor,
  });

  return {
    success: true,
    case: updated,
    message: `Expediente ${codigo} actualizado satisfactoriamente con nueva evaluación de riesgo PxI = ${updated.riskScore}.`,
  };
}

/**
 * Alta y registro formal de un nuevo incidente forense
 */
export async function createNewCase(
  newCaseData: Omit<Case, 'id' | 'riskScore' | 'updatedAt' | 'detectedAt'>
): Promise<Case> {
  const actor = {
    id: newCaseData.leadInvestigatorBadge,
    name: newCaseData.leadInvestigatorName,
    role: 'INVESTIGATOR',
    badgeNumber: newCaseData.leadInvestigatorBadge,
    email: newCaseData.leadInvestigatorEmail,
  };

  return createCaseUseCase.execute({
    input: newCaseData as CreateCaseInput,
    actor,
  });
}

/**
 * Reapertura formal de expediente forense autorizada por Supervisor
 */
export async function reopenCaseByCode(codigo: string, supervisorRole = 'SUPERVISOR'): Promise<Case> {
  const current = await caseRepository.findByCode(codigo);
  if (!current) {
    throw new Error(`Expediente [${codigo}] no localizado.`);
  }

  const actor = {
    id: 'CIB-001-DIR',
    name: 'Comisionado Director',
    role: supervisorRole,
    badgeNumber: 'CIB-001-DIR',
  };

  return transitionCaseStatusUseCase.execute({
    codigo,
    targetStatus: 'ABIERTO',
    reason: 'Reapertura formal autorizada por Supervisor para nuevo taller pericial',
    actor,
  });
}

/**
 * Consulta de jurisprudencia y marco regulatorio digital
 */
export async function getAllRegulations(): Promise<Regulation[]> {
  try {
    const list = await regulationRepository.findAll();
    return list.map((r) => ({
      id: r.regulationId,
      code: r.code,
      name: r.name,
      jurisdiction: r.jurisdiction,
      promulgationDate: r.promulgationDate,
      summary: r.summary,
      keyArticles: r.keyArticles,
      officialLink: r.officialLink || undefined,
    }));
  } catch {
    return INITIAL_REGULATIONS;
  }
}

/**
 * Función de laboratorio para restablecer datos de fixtures en ambiente de desarrollo
 */
export function resetInstitutionalData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cib_ims_cases_store_v4');
    localStorage.removeItem('cib_ims_audit_trail_v4');
    localStorage.removeItem('cib_ims_regulations_store_v4');
  }
}

/**
 * Funciones de soporte heredadas
 */
export function getStoredCases(): Case[] {
  return INITIAL_CASES;
}

export function saveStoredCases(cases: Case[]): void {
  // Manejado internamente por el repositorio
}
