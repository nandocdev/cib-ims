// tests/domain/case-status.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateStatusTransition } from '../../lib/domain/cases/case-status';

test('Máquina de Estados: Transiciones Válidas e Inválidas', async (t) => {
  await t.test('Permite transición de ABIERTO a EN_AUDITORIA con rol AUDITOR o SUPERVISOR', () => {
    const res = validateStatusTransition('ABIERTO', 'EN_AUDITORIA', 'AUDITOR', 'Pase a control de garantías');
    assert.equal(res.allowed, true);
  });

  await t.test('Permite transición de EN_AUDITORIA a CERRADO con rol SUPERVISOR o ADMIN', () => {
    const res = validateStatusTransition('EN_AUDITORIA', 'CERRADO', 'SUPERVISOR', 'Dictamen pericial verificado y aprobado');
    assert.equal(res.allowed, true);
  });

  await t.test('Permite transición directa de ABIERTO a CERRADO con rol SUPERVISOR o ADMIN', () => {
    const res = validateStatusTransition('ABIERTO', 'CERRADO', 'ADMIN', 'Dictamen final emitido y mitigación certificada');
    assert.equal(res.allowed, true);
  });

  await t.test('Permite retorno de EN_AUDITORIA a ABIERTO si se requieren diligencias adicionales', () => {
    const res = validateStatusTransition('EN_AUDITORIA', 'ABIERTO', 'INVESTIGATOR', 'Observaciones técnicas requieren diligencias complementarias');
    assert.equal(res.allowed, true);
  });

  await t.test('Permite reapertura excepcional de CERRADO a ABIERTO con rol SUPERVISOR o ADMIN', () => {
    const res = validateStatusTransition('CERRADO', 'ABIERTO', 'ADMIN', 'Aparición de nueva evidencia digital forense');
    assert.equal(res.allowed, true);
  });

  await t.test('Rechaza reapertura de CERRADO a ABIERTO por un VIEWER o INVESTIGATOR sin privilegio de reapertura', () => {
    const res = validateStatusTransition('CERRADO', 'ABIERTO', 'VIEWER', 'Intento de reapertura no autorizado');
    assert.equal(res.allowed, false);
    assert.match(res.error || '', /Permiso insuficiente/);
  });

  await t.test('Rechaza transición si no se provee motivo justificativo obligatorio', () => {
    const res = validateStatusTransition('ABIERTO', 'EN_AUDITORIA', 'AUDITOR', '');
    assert.equal(res.allowed, false);
    assert.match(res.error || '', /Motivación obligatoria/);
  });

  await t.test('Rechaza transición arbitraria inválida (ej: CERRADO directo a EN_AUDITORIA)', () => {
    const res = validateStatusTransition('CERRADO', 'EN_AUDITORIA', 'ADMIN', 'Intento inválido');
    assert.equal(res.allowed, false);
    assert.match(res.error || '', /Transición de estado inválida/);
  });
});
