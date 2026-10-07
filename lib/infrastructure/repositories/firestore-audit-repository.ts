// lib/infrastructure/repositories/firestore-audit-repository.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Repositorio de Auditoría Forense de Solo-Anexado (Append-Only) con Hash Encadenado

import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { AuditEntry, AuditEntrySchema } from '@/lib/domain/audit/audit-entry';
import { verifyEventChain, ChainVerificationResult, GENESIS_HASH } from '@/lib/domain/crypto/hasher';
import { logger } from '@/lib/observability/logger';

const LOCAL_AUDIT_KEY = 'cib_ims_audit_trail_v4';

export class FirestoreAuditRepository {
  private getLocalAuditTrail(caseId?: string): AuditEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LOCAL_AUDIT_KEY);
      if (raw) {
        const parsed: AuditEntry[] = JSON.parse(raw);
        if (caseId) {
          return parsed.filter((e) => e.caseId.toUpperCase() === caseId.toUpperCase());
        }
        return parsed;
      }
    } catch {
      // Ignorar errores de parseo
    }
    return [];
  }

  private appendLocalAuditEntry(entry: AuditEntry): void {
    if (typeof window !== 'undefined') {
      try {
        const all = this.getLocalAuditTrail();
        all.push(entry);
        localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(all));
      } catch (err) {
        logger.warn('Error al guardar log de auditoría en caché local', undefined, err);
      }
    }
  }

  /**
   * Obtiene el último hash registrado para un expediente para encadenar el siguiente eslabón
   */
  async getLatestHash(caseId: string): Promise<string> {
    const entries = await this.findByCaseId(caseId);
    if (entries.length === 0) {
      return GENESIS_HASH;
    }
    return entries[entries.length - 1].currentHash;
  }

  /**
   * Registra una nueva entrada de auditoría (operación inmutable: sin edición ni borrado)
   */
  async append(entry: AuditEntry): Promise<AuditEntry> {
    const validated = AuditEntrySchema.parse(entry);

    // 1. Guardar en Firestore bajo subcolección del expediente
    try {
      if (db && typeof db.app !== 'undefined') {
        const auditDocRef = doc(db, 'cases', validated.caseId.toUpperCase(), 'audit_trail', validated.auditId);
        await setDoc(auditDocRef, validated);
        logger.info(`Evento de auditoría [${validated.action}] registrado en Firestore`, {
          caseId: validated.caseId,
          auditId: validated.auditId,
          action: validated.action,
        });
      }
    } catch (err) {
      logger.warn(`Registro de auditoría Firestore degradado a almacenamiento local`, {
        caseId: validated.caseId,
        auditId: validated.auditId,
      }, err);
    }

    // 2. Anexar a almacenamiento local
    this.appendLocalAuditEntry(validated);

    return validated;
  }

  /**
   * Consulta el historial cronológico de auditoría para un expediente
   */
  async findByCaseId(caseId: string): Promise<AuditEntry[]> {
    const normalizedCaseId = caseId.toUpperCase();
    let entries: AuditEntry[] = [];

    try {
      if (db && typeof db.app !== 'undefined') {
        const auditCollRef = collection(db, 'cases', normalizedCaseId, 'audit_trail');
        const q = query(auditCollRef, orderBy('timestamp', 'asc'));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          snapshot.forEach((d) => {
            const parsed = AuditEntrySchema.safeParse(d.data());
            if (parsed.success) {
              entries.push(parsed.data);
            }
          });
        }
      }
    } catch (err) {
      logger.warn(`Lectura de auditoría Firestore para [${normalizedCaseId}] degradada a local`, undefined, err);
    }

    if (entries.length === 0) {
      entries = this.getLocalAuditTrail(normalizedCaseId);
    }

    // Ordenar cronológicamente ascendente
    return entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Verifica la integridad criptográfica de la cadena de auditoría de un expediente
   */
  async verifyChainIntegrity(caseId: string): Promise<ChainVerificationResult> {
    const entries = await this.findByCaseId(caseId);
    if (entries.length === 0) {
      return { isValid: true };
    }

    const verificationInput = entries.map((e) => ({
      previousHash: e.previousHash,
      currentHash: e.currentHash,
      canonicalEventData: {
        caseId: e.caseId,
        actorId: e.actorId,
        action: e.action,
        reason: e.reason,
        previousState: e.previousState,
        newState: e.newState,
        metadata: e.metadata,
      },
      timestamp: e.timestamp,
      actorId: e.actorId,
      action: e.action,
    }));

    return verifyEventChain(verificationInput);
  }
}

export const auditRepository = new FirestoreAuditRepository();
