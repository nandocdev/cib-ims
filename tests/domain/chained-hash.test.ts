// tests/domain/chained-hash.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeChainedHash,
  verifyEventChain,
  GENESIS_HASH,
  canonicalJsonStringify,
} from '../../lib/domain/crypto/hasher';

test('Criptografía: Hash Encadenado y Detección de Alteraciones', async (t) => {
  await t.test('Serialización JSON canónica produce salida determinística sin importar orden de claves', () => {
    const objA = { z: 1, a: 2, m: { y: 'bar', x: 'foo' } };
    const objB = { a: 2, m: { x: 'foo', y: 'bar' }, z: 1 };
    assert.equal(canonicalJsonStringify(objA), canonicalJsonStringify(objB));
  });

  await t.test('Verifica con éxito una cadena ininterrumpida de eventos encadenados', async () => {
    const timestamp1 = '2026-02-10T10:00:00.000Z';
    const hash1 = await computeChainedHash({
      previousHash: GENESIS_HASH,
      canonicalEventData: { action: 'CASE_CREATED', caseId: 'CIB-2026-001-TG' },
      timestamp: timestamp1,
      actorId: 'CIB-001-DIR',
      action: 'CASE_CREATED',
    });

    const timestamp2 = '2026-02-11T12:00:00.000Z';
    const hash2 = await computeChainedHash({
      previousHash: hash1,
      canonicalEventData: { action: 'EVIDENCE_ADDED', evidenceCode: 'EV-001' },
      timestamp: timestamp2,
      actorId: 'CIB-101-FOR',
      action: 'EVIDENCE_ADDED',
    });

    const chain = [
      {
        previousHash: GENESIS_HASH,
        currentHash: hash1,
        canonicalEventData: { action: 'CASE_CREATED', caseId: 'CIB-2026-001-TG' },
        timestamp: timestamp1,
        actorId: 'CIB-001-DIR',
        action: 'CASE_CREATED',
      },
      {
        previousHash: hash1,
        currentHash: hash2,
        canonicalEventData: { action: 'EVIDENCE_ADDED', evidenceCode: 'EV-001' },
        timestamp: timestamp2,
        actorId: 'CIB-101-FOR',
        action: 'EVIDENCE_ADDED',
      },
    ];

    const result = await verifyEventChain(chain);
    assert.equal(result.isValid, true);
  });

  await t.test('Detecta alteración fraudulenta en el contenido de un evento histórico intermedio', async () => {
    const timestamp1 = '2026-02-10T10:00:00.000Z';
    const hash1 = await computeChainedHash({
      previousHash: GENESIS_HASH,
      canonicalEventData: { action: 'CASE_CREATED', caseId: 'CIB-2026-001-TG' },
      timestamp: timestamp1,
      actorId: 'CIB-001-DIR',
      action: 'CASE_CREATED',
    });

    // Simulamos un intento de fraude alterando el payload del evento #0
    const tamperedChain = [
      {
        previousHash: GENESIS_HASH,
        currentHash: hash1,
        canonicalEventData: { action: 'CASE_CREATED', caseId: 'CIB-2026-999-HACKED' }, // Contenido adulterado
        timestamp: timestamp1,
        actorId: 'CIB-001-DIR',
        action: 'CASE_CREATED',
      },
    ];

    const result = await verifyEventChain(tamperedChain);
    assert.equal(result.isValid, false);
    assert.equal(result.tamperedIndex, 0);
  });
});
