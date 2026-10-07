// lib/domain/crypto/hasher.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Utilidad Criptográfica de Hash Encadenado para Detección de Alteraciones (Tamper-Evidence)

import crypto from 'crypto';

/**
 * Serialización determinística (canonical JSON) ordenando claves para asegurar hashes reproducibles
 */
export function canonicalJsonStringify(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalJsonStringify).join(',') + ']';
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const entries = keys.map(
    (key) => `${JSON.stringify(key)}:${canonicalJsonStringify((obj as Record<string, unknown>)[key])}`
  );
  return '{' + entries.join(',') + '}';
}

/**
 * Calcula el hash SHA-256 en entornos tanto Node.js (servidor) como WebCrypto (navegador)
 */
export async function sha256Hex(content: string): Promise<string> {
  // Entorno Node.js con módulo nativo crypto
  if (typeof crypto !== 'undefined' && crypto.createHash) {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
  }

  // Entorno Navegador con Web Cryptography API
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Fallback seguro usando función pura si no hay crypto global
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

export interface ChainedHashInput {
  previousHash: string;
  canonicalEventData: unknown;
  timestamp: string;
  actorId: string;
  action: string;
}

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Genera el hash encadenado para un evento:
 * SHA256(previousHash + "|" + canonicalJson(eventData) + "|" + timestamp + "|" + actorId + "|" + action)
 */
export async function computeChainedHash(input: ChainedHashInput): Promise<string> {
  const payload = [
    input.previousHash || GENESIS_HASH,
    canonicalJsonStringify(input.canonicalEventData),
    input.timestamp,
    input.actorId,
    input.action,
  ].join('|');

  return sha256Hex(payload);
}

export interface ChainVerificationResult {
  isValid: boolean;
  tamperedIndex?: number;
  expectedHash?: string;
  actualHash?: string;
  details?: string;
}

/**
 * Verifica una secuencia completa de eventos con hash encadenado para detectar inserciones,
 * eliminaciones o modificaciones no autorizadas en el historial.
 */
export async function verifyEventChain(
  events: Array<{
    previousHash?: string;
    currentHash: string;
    canonicalEventData: unknown;
    timestamp: string;
    actorId: string;
    action: string;
  }>
): Promise<ChainVerificationResult> {
  let expectedPrevHash = GENESIS_HASH;

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const prev = ev.previousHash || GENESIS_HASH;

    if (prev !== expectedPrevHash) {
      return {
        isValid: false,
        tamperedIndex: i,
        expectedHash: expectedPrevHash,
        actualHash: prev,
        details: `Ruptura de continuidad en el eslabón #${i}: previousHash no coincide con el eslabón anterior`,
      };
    }

    const calculated = await computeChainedHash({
      previousHash: prev,
      canonicalEventData: ev.canonicalEventData,
      timestamp: ev.timestamp,
      actorId: ev.actorId,
      action: ev.action,
    });

    if (calculated !== ev.currentHash) {
      return {
        isValid: false,
        tamperedIndex: i,
        expectedHash: calculated,
        actualHash: ev.currentHash,
        details: `Alteración de datos detectada en el eslabón #${i}: el hash calculado no coincide con currentHash`,
      };
    }

    expectedPrevHash = ev.currentHash;
  }

  return { isValid: true };
}
