// tests/application/case-use-cases.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { ICaseRepository, CaseFilters } from '../../lib/infrastructure/repositories/case-repository.interface';
import { Case } from '../../lib/domain/cases/case';
import { CreateCaseUseCase } from '../../lib/application/cases/create-case-use-case';
import { UpdateCaseUseCase } from '../../lib/application/cases/update-case-use-case';
import { TransitionCaseStatusUseCase } from '../../lib/application/cases/transition-case-status-use-case';
import { FirestoreAuditRepository } from '../../lib/infrastructure/repositories/firestore-audit-repository';

// Mock in-memory del repositorio de casos para pruebas aisladas
class MockCaseRepository implements ICaseRepository {
  private cases = new Map<string, Case>();

  async findById(id: string): Promise<Case | null> {
    for (const c of this.cases.values()) {
      if (c.id === id) return c;
    }
    return null;
  }

  async findByCode(code: string): Promise<Case | null> {
    return this.cases.get(code.toUpperCase()) || null;
  }

  async findAll(filters?: CaseFilters): Promise<Case[]> {
    return Array.from(this.cases.values());
  }

  async create(caseEntity: Case): Promise<Case> {
    this.cases.set(caseEntity.codigo.toUpperCase(), caseEntity);
    return caseEntity;
  }

  async update(code: string, updates: Partial<Case>): Promise<Case> {
    const existing = this.cases.get(code.toUpperCase());
    if (!existing) throw new Error('Not found');
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.cases.set(code.toUpperCase(), updated);
    return updated;
  }

  async existsByCode(code: string): Promise<boolean> {
    return this.cases.has(code.toUpperCase());
  }
}

test('Casos de Uso de Aplicación: Creación, Actualización y Ciclo de Vida', async (t) => {
  const caseRepo = new MockCaseRepository();
  const auditRepo = new FirestoreAuditRepository();
  const createCase = new CreateCaseUseCase(caseRepo, auditRepo);
  const updateCase = new UpdateCaseUseCase(caseRepo, auditRepo);
  const transitionStatus = new TransitionCaseStatusUseCase(caseRepo, auditRepo);

  const directorActor = {
    id: 'user-001',
    email: 'usuario1@cib.gob.pa',
    name: 'Comisionado Director',
    role: 'ADMIN',
    badgeNumber: 'CIB-001-DIR',
  };

  const cadetActor = {
    id: 'user-009',
    email: 'cadete1@cib.gob.pa',
    name: 'Cadete Observador',
    role: 'VIEWER',
    badgeNumber: 'CIB-401-CAD',
  };

  await t.test('Rechaza creación de caso si el actor no tiene el permiso case.create', async () => {
    await assert.rejects(
      async () => {
        await createCase.execute({
          input: {
            codigo: 'CIB-2026-999-TEST',
            title: 'Caso de Prueba No Autorizado',
            operationCodename: 'Operación Test',
            summary: 'Resumen descriptivo del incidente para prueba de validación de acceso.',
            classification: 'CONFIDENCIAL',
            status: 'ABIERTO',
            vector: 'RANSOMWARE',
            probability: 3,
            impact: 4,
            leadInvestigatorBadge: 'CIB-401-CAD',
            leadInvestigatorEmail: 'cadete1@cib.gob.pa',
            leadInvestigatorName: 'Cadete Observador',
            targetEntity: 'Servidor Test',
            mitigationMeasures: ['Aislamiento'],
            applicableRegulations: ['LEY-81-2019'],
          },
          actor: cadetActor,
        });
      },
      /ACCESO DENEGADO/
    );
  });

  await t.test('Crea caso exitosamente y deriva automáticamente el score de riesgo P x I', async () => {
    const created = await createCase.execute({
      input: {
        codigo: 'CIB-2026-999-TEST',
        title: 'Intrusión a Servidor Central Gubernamental',
        operationCodename: 'Operación Centinela',
        summary: 'Compromiso detectado en el perímetro de acceso remoto con credenciales filtradas.',
        classification: 'CONFIDENCIAL',
        status: 'ABIERTO',
        vector: 'ZERO_DAY_EXPLOIT',
        probability: 4,
        impact: 5,
        leadInvestigatorBadge: 'CIB-001-DIR',
        leadInvestigatorEmail: 'usuario1@cib.gob.pa',
        leadInvestigatorName: 'Comisionado Director',
        targetEntity: 'Centro de Datos Gubernamental',
        mitigationMeasures: ['Bloqueo perimetral'],
        applicableRegulations: ['RES-AIG-18-2026'],
      },
      actor: directorActor,
    });

    assert.equal(created.codigo, 'CIB-2026-999-TEST');
    assert.equal(created.riskScore, 20); // 4 * 5 = 20
    assert.equal(created.status, 'ABIERTO');
  });

  await t.test('Bloquea creación de caso duplicado con el mismo código', async () => {
    await assert.rejects(
      async () => {
        await createCase.execute({
          input: {
            codigo: 'CIB-2026-999-TEST',
            title: 'Duplicado',
            operationCodename: 'Operación Duplicado',
            summary: 'Resumen de prueba duplicada con código idéntico.',
            classification: 'RESERVADO',
            status: 'ABIERTO',
            vector: 'SUPPLY_CHAIN',
            probability: 2,
            impact: 2,
            leadInvestigatorBadge: 'CIB-001-DIR',
            leadInvestigatorEmail: 'usuario1@cib.gob.pa',
            leadInvestigatorName: 'Comisionado Director',
            targetEntity: 'Test',
            mitigationMeasures: [],
            applicableRegulations: [],
          },
          actor: directorActor,
        });
      },
      /CONFLICTO/
    );
  });

  await t.test('Actualiza caso y recalcula el riesgo derivado de nuevas variables', async () => {
    const updated = await updateCase.execute({
      codigo: 'CIB-2026-999-TEST',
      updates: {
        probability: 2,
        impact: 3,
      },
      reason: 'Reevaluación tras aplicar parches compensatorios',
      actor: directorActor,
    });

    assert.equal(updated.probability, 2);
    assert.equal(updated.impact, 3);
    assert.equal(updated.riskScore, 6); // 2 * 3 = 6
  });

  await t.test('Transiciona a CERRADO con dictamen y genera sello criptográfico SHA-256', async () => {
    const closed = await transitionStatus.execute({
      codigo: 'CIB-2026-999-TEST',
      targetStatus: 'CERRADO',
      reason: 'Dictamen pericial definitivo aprobado',
      resolutionVerdict: 'Controles verificados conforme a la Resolución AIG 18-2026.',
      residualProbability: 1,
      residualImpact: 2,
      actor: directorActor,
    });

    assert.equal(closed.status, 'CERRADO');
    assert.ok(closed.sealedAt);
    assert.ok(closed.resolutionHash);
    assert.equal(closed.resolutionHash.length, 64);
    assert.equal(closed.residualRiskScore, 2); // 1 * 2 = 2
  });

  await t.test('Impide actualización técnica ordinaria sobre un caso cerrado sin reapertura formal', async () => {
    await assert.rejects(
      async () => {
        await updateCase.execute({
          codigo: 'CIB-2026-999-TEST',
          updates: { title: 'Intento de Modificación Ilegal' },
          actor: directorActor,
        });
      },
      /VIOLACIÓN DE CADENA DE CUSTODIA/
    );
  });
});
