// lib/infrastructure/repositories/case-repository.interface.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Contrato de Repositorio para la Gestión de Expedientes Forenses

import { Case } from '@/lib/domain/cases/case';
import { CaseStatus } from '@/lib/domain/cases/case-status';
import { CaseClassification, AttackVector } from '@/lib/domain/cases/case';

export interface CaseFilters {
  status?: CaseStatus | 'ALL';
  vector?: AttackVector | 'ALL';
  classification?: CaseClassification | 'ALL';
  searchTerm?: string;
  leadInvestigatorBadge?: string;
}

export interface ICaseRepository {
  findById(id: string): Promise<Case | null>;
  findByCode(code: string): Promise<Case | null>;
  findAll(filters?: CaseFilters): Promise<Case[]>;
  create(caseEntity: Case): Promise<Case>;
  update(code: string, updates: Partial<Case>): Promise<Case>;
  existsByCode(code: string): Promise<boolean>;
}
