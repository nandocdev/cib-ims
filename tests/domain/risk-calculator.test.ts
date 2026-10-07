// tests/domain/risk-calculator.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRiskScore, getRiskSeverity, evaluateRisk } from '../../lib/domain/risk/risk-calculator';

test('Dominio de Riesgo: Derivación Centralizada y Clasificación', async (t) => {
  await t.test('Calcula producto P x I con números enteros estándar', () => {
    assert.equal(calculateRiskScore(4, 5), 20);
    assert.equal(calculateRiskScore(3, 4), 12);
    assert.equal(calculateRiskScore(1, 1), 1);
    assert.equal(calculateRiskScore(5, 5), 25);
  });

  await t.test('Limita automáticamente valores de probabilidad e impacto entre 1 y 5', () => {
    assert.equal(calculateRiskScore(10, 0), 5); // 5 x 1 = 5
    assert.equal(calculateRiskScore(-2, 8), 5); // 1 x 5 = 5
  });

  await t.test('Clasifica severidades correctamente conforme a la escala institucional', () => {
    assert.equal(getRiskSeverity(25), 'CRITICO');
    assert.equal(getRiskSeverity(20), 'CRITICO');
    assert.equal(getRiskSeverity(16), 'ALTO');
    assert.equal(getRiskSeverity(12), 'MEDIO');
    assert.equal(getRiskSeverity(8), 'MEDIO');
    assert.equal(getRiskSeverity(4), 'BAJO');
    assert.equal(getRiskSeverity(1), 'BAJO');
  });

  await t.test('Activa bandera de Alerta Roja institucional si P x I >= 20 (Res. AIG 18-2026)', () => {
    const criticalEval = evaluateRisk(4, 5);
    assert.equal(criticalEval.score, 20);
    assert.equal(criticalEval.isRedAlert, true);
    assert.equal(criticalEval.severity, 'CRITICO');

    const highEval = evaluateRisk(4, 4);
    assert.equal(highEval.score, 16);
    assert.equal(highEval.isRedAlert, false);
    assert.equal(highEval.severity, 'ALTO');
  });
});
