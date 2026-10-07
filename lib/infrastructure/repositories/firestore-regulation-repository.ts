// lib/infrastructure/repositories/firestore-regulation-repository.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Repositorio de Jurisprudencia y Marco Legal Digital

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { LegalRegulation, LegalRegulationSchema } from '@/lib/domain/legal/regulation';
import { INITIAL_REGULATIONS } from '@/lib/data/initial-data';
import { logger } from '@/lib/observability/logger';

const LOCAL_REGS_KEY = 'cib_ims_regulations_store_v4';

export class FirestoreRegulationRepository {
  private collectionName = 'regulations';

  private getLocalCache(): LegalRegulation[] {
    if (typeof window === 'undefined') {
      return INITIAL_REGULATIONS.map((r) => ({
        regulationId: r.id,
        code: r.code,
        name: r.name,
        jurisdiction: r.jurisdiction,
        promulgationDate: r.promulgationDate,
        version: '1.0',
        status: 'VIGENTE',
        summary: r.summary,
        keyArticles: r.keyArticles,
        officialLink: r.officialLink || null,
      }));
    }
    try {
      const raw = localStorage.getItem(LOCAL_REGS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Ignorar errores
    }
    return INITIAL_REGULATIONS.map((r) => ({
      regulationId: r.id,
      code: r.code,
      name: r.name,
      jurisdiction: r.jurisdiction,
      promulgationDate: r.promulgationDate,
      version: '1.0',
      status: 'VIGENTE',
      summary: r.summary,
      keyArticles: r.keyArticles,
      officialLink: r.officialLink || null,
    }));
  }

  private setLocalCache(regs: LegalRegulation[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_REGS_KEY, JSON.stringify(regs));
      } catch (err) {
        logger.warn('Error al persistir regulaciones en caché local', undefined, err);
      }
    }
  }

  async findAll(): Promise<LegalRegulation[]> {
    try {
      if (db && typeof db.app !== 'undefined') {
        const collRef = collection(db, this.collectionName);
        const snapshot = await getDocs(collRef);

        if (!snapshot.empty) {
          const items: LegalRegulation[] = [];
          snapshot.forEach((d) => {
            const parsed = LegalRegulationSchema.safeParse(d.data());
            if (parsed.success) {
              items.push(parsed.data);
            }
          });
          if (items.length > 0) {
            this.setLocalCache(items);
            return items;
          }
        }
      }
    } catch (err) {
      logger.warn('Lectura de regulaciones Firestore degradada a caché local', undefined, err);
    }

    return this.getLocalCache();
  }

  async findByCode(code: string): Promise<LegalRegulation | null> {
    const all = await this.findAll();
    return all.find((r) => r.code.toUpperCase() === code.toUpperCase()) || null;
  }
}

export const regulationRepository = new FirestoreRegulationRepository();
