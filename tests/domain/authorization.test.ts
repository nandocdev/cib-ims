// tests/domain/authorization.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { canActor, hasPermission } from '../../lib/domain/auth/role-permissions';

test('Seguridad y Autorización: Control de Acceso Basado en Roles (RBAC)', async (t) => {
  await t.test('ADMIN posee permisos de creación, actualización, cierre, reapertura y sembrado', () => {
    assert.equal(hasPermission('ADMIN', 'case.create'), true);
    assert.equal(hasPermission('ADMIN', 'case.update'), true);
    assert.equal(hasPermission('ADMIN', 'case.close'), true);
    assert.equal(hasPermission('ADMIN', 'case.reopen'), true);
    assert.equal(hasPermission('ADMIN', 'system.seed'), true);
  });

  await t.test('INVESTIGATOR puede crear y actualizar casos y evidencias, pero no cerrar ni sembrar', () => {
    assert.equal(hasPermission('INVESTIGATOR', 'case.create'), true);
    assert.equal(hasPermission('INVESTIGATOR', 'case.update'), true);
    assert.equal(hasPermission('INVESTIGATOR', 'evidence.create'), true);
    assert.equal(hasPermission('INVESTIGATOR', 'evidence.transfer'), true);
    assert.equal(hasPermission('INVESTIGATOR', 'case.close'), false);
    assert.equal(hasPermission('INVESTIGATOR', 'case.reopen'), false);
    assert.equal(hasPermission('INVESTIGATOR', 'system.seed'), false);
  });

  await t.test('AUDITOR puede auditar casos e inspeccionar registros, pero no crear ni editar arbitrariamente', () => {
    assert.equal(hasPermission('AUDITOR', 'case.audit'), true);
    assert.equal(hasPermission('AUDITOR', 'audit.read'), true);
    assert.equal(hasPermission('AUDITOR', 'case.create'), false);
    assert.equal(hasPermission('AUDITOR', 'case.update'), false);
  });

  await t.test('VIEWER solo tiene privilegios de lectura, ningún permiso de mutación', () => {
    assert.equal(hasPermission('VIEWER', 'case.read'), true);
    assert.equal(hasPermission('VIEWER', 'evidence.read'), true);
    assert.equal(hasPermission('VIEWER', 'case.create'), false);
    assert.equal(hasPermission('VIEWER', 'case.update'), false);
    assert.equal(hasPermission('VIEWER', 'case.close'), false);
  });

  await t.test('Mapea correctamente roles institucionales legados a roles del sistema', () => {
    assert.equal(canActor('COMISIONADO_DIRECTOR', 'case.close'), true);
    assert.equal(canActor('AGENTE_FORENSE_TECNICO', 'evidence.transfer'), true);
    assert.equal(canActor('OBSERVADOR_CADETE', 'case.update'), false);
  });

  await t.test('Rechaza llamadas con rol nulo, indefinido o no reconocido', () => {
    assert.equal(canActor(null, 'case.read'), false);
    assert.equal(canActor(undefined, 'case.read'), false);
    assert.equal(canActor('HACKER_ROLE', 'case.read'), false);
  });
});
