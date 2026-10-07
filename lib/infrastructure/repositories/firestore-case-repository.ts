// lib/infrastructure/repositories/firestore-case-repository.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Implementación de Repositorio de Expedientes en Cloud Firestore con Resiliencia

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Case, CaseSchema } from '@/lib/domain/cases/case';
import { ICaseRepository, CaseFilters } from './case-repository.interface';
import { logger } from '@/lib/observability/logger';
import { INITIAL_CASES } from '@/lib/data/initial-cases';

const LOCAL_STORAGE_CACHE_KEY = 'cib_ims_cases_store_v4';

export class FirestoreCaseRepository implements ICaseRepository {
  private collectionName = 'cases';

  private getLocalCache(): Case[] {
    if (typeof window === 'undefined') {
      return INITIAL_CASES;
    }
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_CASES.length) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_CASES;
  }

  private setLocalCache(cases: Case[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(cases));
      } catch (err) {
        logger.warn('Error al persistir caché local de expedientes', undefined, err);
      }
    }
  }

  async findByCode(code: string): Promise<Case | null> {
    const normalizedCode = code.toUpperCase();

    // 1. Intentar consulta en Firestore
    try {
      if (db && typeof db.app !== 'undefined') {
        const docRef = doc(db, this.collectionName, normalizedCode);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const rawData = snapshot.data();
          const parsed = CaseSchema.safeParse(rawData);
          if (parsed.success) {
            return parsed.data;
          } else {
            logger.warn(`Documento [${code}] en Firestore con esquema inconsistente`, {
              code,
              errors: parsed.error.issues,
            });
            return rawData as Case;
          }
        }
      }
    } catch (err) {
      logger.warn(`Firestore read fallback para expediente [${code}]`, { code }, err);
    }

    // 2. Fallback a caché local institucional
    const local = this.getLocalCache().find((c) => c.codigo.toUpperCase() === normalizedCode);
    return local || null;
  }

  async findById(id: string): Promise<Case | null> {
    const local = this.getLocalCache().find((c) => c.id === id);
    if (local) return local;
    const all = await this.findAll();
    return all.find((c) => c.id === id) || null;
  }

  async findAll(filters?: CaseFilters): Promise<Case[]> {
    let resultList: Case[] = [];
    let fetchedFromFirestore = false;

    try {
      if (db && typeof db.app !== 'undefined') {
        const collRef = collection(db, this.collectionName);
        const snapshot = await getDocs(collRef);

        if (!snapshot.empty) {
          const items: Case[] = [];
          snapshot.forEach((d) => {
            const parsed = CaseSchema.safeParse(d.data());
            if (parsed.success) {
              items.push(parsed.data);
            } else {
              items.push(d.data() as Case);
            }
          });
          if (items.length > 0) {
            resultList = items;
            fetchedFromFirestore = true;
            this.setLocalCache(items);
          }
        }
      }
    } catch (err) {
      logger.warn('Lectura de todos los casos desde Firestore degradada a caché local', undefined, err);
    }

    if (!fetchedFromFirestore || resultList.length === 0) {
      resultList = this.getLocalCache();
    }

    // Aplicar filtros en memoria si corresponde
    if (filters) {
      if (filters.status && filters.status !== 'ALL') {
        resultList = resultList.filter((c) => c.status === filters.status);
      }
      if (filters.vector && filters.vector !== 'ALL') {
        resultList = resultList.filter((c) => c.vector === filters.vector);
      }
      if (filters.classification && filters.classification !== 'ALL') {
        resultList = resultList.filter((c) => c.classification === filters.classification);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        resultList = resultList.filter(
          (c) =>
            c.codigo.toLowerCase().includes(term) ||
            c.title.toLowerCase().includes(term) ||
            c.operationCodename.toLowerCase().includes(term) ||
            c.targetEntity.toLowerCase().includes(term)
        );
      }
      if (filters.leadInvestigatorBadge) {
        resultList = resultList.filter((c) => c.leadInvestigatorBadge === filters.leadInvestigatorBadge);
      }
    }

    return resultList;
  }

  async create(caseEntity: Case): Promise<Case> {
    const validated = CaseSchema.parse(caseEntity);
    const normalizedCode = validated.codigo.toUpperCase();

    // 1. Guardar en Firestore
    try {
      if (db && typeof db.app !== 'undefined') {
        const docRef = doc(db, this.collectionName, normalizedCode);
        await setDoc(docRef, validated);
        logger.info(`Expediente [${normalizedCode}] creado en Cloud Firestore`, { caseId: validated.id, code: normalizedCode });
      }
    } catch (err) {
      logger.error(`Error al persistir nuevo expediente [${normalizedCode}] en Firestore`, { code: normalizedCode }, err);
    }

    // 2. Actualizar caché local
    const currentList = this.getLocalCache().filter((c) => c.codigo.toUpperCase() !== normalizedCode);
    currentList.unshift(validated);
    this.setLocalCache(currentList);

    return validated;
  }

  async update(code: string, updates: Partial<Case>): Promise<Case> {
    const normalizedCode = code.toUpperCase();
    const existing = await this.findByCode(normalizedCode);

    if (!existing) {
      throw new Error(`Expediente [${code}] no localizado para actualización.`);
    }

    const merged: Case = {
      ...existing,
      ...updates,
      codigo: normalizedCode, // Inmutable
      updatedAt: new Date().toISOString(),
    };

    const validated = CaseSchema.parse(merged);

    // 1. Persistir en Firestore
    try {
      if (db && typeof db.app !== 'undefined') {
        const docRef = doc(db, this.collectionName, normalizedCode);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: validated.updatedAt,
        });
        logger.info(`Expediente [${normalizedCode}] actualizado en Firestore`, { code: normalizedCode });
      }
    } catch (err) {
      logger.warn(`Actualización Firestore para [${normalizedCode}] degradada a persistencia local`, { code: normalizedCode }, err);
    }

    // 2. Actualizar caché local
    const all = this.getLocalCache().map((c) => (c.codigo.toUpperCase() === normalizedCode ? validated : c));
    this.setLocalCache(all);

    return validated;
  }

  async existsByCode(code: string): Promise<boolean> {
    const found = await this.findByCode(code);
    return Boolean(found);
  }
}

export const caseRepository = new FirestoreCaseRepository();
