// lib/case-service.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Capa de Servicios Forenses y Gestión de Expedientes con Respaldo Reactivo

import { Case, EvidenceArtifact, TimelineDay, InterrogationQuestion, Regulation } from '@/types/cib';
import { INITIAL_CASES, INITIAL_REGULATIONS } from './data/initial-data';
import { db, handleFirestoreError, OperationType } from './firebase/client';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

const STORAGE_CASES_KEY = 'cib_ims_cases_cache_v3';
const STORAGE_REGS_KEY = 'cib_ims_regs_cache_v3';

// Función para obtener casos locales iniciales o almacenados en cache de sesión
export function getStoredCases(): Case[] {
  if (typeof window === 'undefined') {
    return INITIAL_CASES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_CASES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(INITIAL_CASES));
      return INITIAL_CASES;
    }
    const parsed: Case[] = JSON.parse(raw);
    // Si la cache tiene menos casos que el catálogo oficial (14 casos), sincronizar al catálogo completo
    if (!Array.isArray(parsed) || parsed.length < INITIAL_CASES.length) {
      localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(INITIAL_CASES));
      return INITIAL_CASES;
    }
    return parsed;
  } catch {
    return INITIAL_CASES;
  }
}

export function saveStoredCases(cases: Case[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(cases));
    } catch (e) {
      console.warn('Error saving cases locally:', e);
    }
  }
}

/**
 * Obtener todos los casos del repositorio con métricas calculadas
 */
export async function getAllCases(): Promise<Case[]> {
  try {
    // Si Firestore está disponible en el cliente, intentar lectura
    if (db && typeof db.app !== 'undefined') {
      try {
        const querySnapshot = await getDocs(collection(db, 'cases'));
        if (!querySnapshot.empty) {
          const list: Case[] = [];
          querySnapshot.forEach((d) => {
            list.push(d.data() as Case);
          });
          saveStoredCases(list);
          return list;
        }
      } catch (firestoreError) {
        // En caso de modo offline o sin credenciales, advertencia controlada y fallback
        console.info('[CIB-IMS] Firestore remoto offline/fallback local:', firestoreError);
      }
    }
  } catch (err) {
    console.warn('[CIB-IMS] Error al leer Firestore, utilizando repositorio local:', err);
  }
  return getStoredCases();
}

/**
 * Obtener expediente completo con artefactos de evidencia, bitácora y preguntas
 */
export async function getCaseByCode(codigo: string): Promise<Case | null> {
  const cases = getStoredCases();
  const found = cases.find((c) => c.codigo.toUpperCase() === codigo.toUpperCase());

  if (!found) return null;

  try {
    if (db && typeof db.app !== 'undefined') {
      const caseDocRef = doc(db, 'cases', codigo);
      const caseSnap = await getDoc(caseDocRef);
      if (caseSnap.exists()) {
        const data = caseSnap.data() as Case;
        return {
          ...found,
          ...data,
          evidence: found.evidence,
          timeline: found.timeline,
          interrogations: found.interrogations,
        };
      }
    }
  } catch {
    // Retornar la copia local completa
  }

  return found;
}

/**
 * Actualizar expediente técnico.
 * REGLA FORENSE INMUTABLE:
 * SOLO SE PERMITE MODIFICAR SI EL CASO ESTÁ EN ESTADO 'ABIERTO'.
 * Si el caso está en 'EN_AUDITORIA' o 'CERRADO', se lanza un error de violación de protocolo.
 */
export async function updateCaseByCode(
  codigo: string,
  updatedFields: Partial<Case>,
  userRole?: string
): Promise<{ success: boolean; case: Case; message?: string }> {
  const cases = getStoredCases();
  const index = cases.findIndex((c) => c.codigo.toUpperCase() === codigo.toUpperCase());

  if (index === -1) {
    throw new Error(`Expediente ${codigo} no fue encontrado en los registros del CIB.`);
  }

  const currentCase = cases[index];

  // REGLA FUNDAMENTAL DE INMUTABILIDAD FORENSE:
  if (currentCase.status !== 'ABIERTO') {
    const errorMsg = `VIOLACIÓN DE CADENA DE CUSTODIA FORENSE: El expediente [${currentCase.codigo}] se encuentra en estado '${currentCase.status}'. Conforme a la Ley 51 de 2008 y Resolución AIG 18-2026, los expedientes en auditoría o cerrados poseen sello criptográfico inmutable y no admiten modificaciones.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Recalcular P x I si se actualizaron probabilidad o impacto
  const probability = updatedFields.probability ?? currentCase.probability;
  const impact = updatedFields.impact ?? currentCase.impact;
  const riskScore = probability * impact;

  const modifiedCase: Case = {
    ...currentCase,
    ...updatedFields,
    probability,
    impact,
    riskScore,
    updatedAt: new Date().toISOString(),
  };

  // Si se transiciona el estado a CERRADO, asentar fecha de sellado
  if (updatedFields.status === 'CERRADO' && !modifiedCase.sealedAt) {
    modifiedCase.sealedAt = new Date().toISOString();
  }

  cases[index] = modifiedCase;
  saveStoredCases(cases);

  // Sincronizar con Firestore si está conectado
  try {
    if (db && typeof db.app !== 'undefined') {
      const caseDocRef = doc(db, 'cases', codigo);
      await updateDoc(caseDocRef, {
        ...updatedFields,
        riskScore,
        updatedAt: modifiedCase.updatedAt,
        ...(modifiedCase.sealedAt ? { sealedAt: modifiedCase.sealedAt } : {}),
        ...(modifiedCase.resolutionVerdict ? { resolutionVerdict: modifiedCase.resolutionVerdict } : {}),
        ...(modifiedCase.residualRiskScore !== undefined ? { residualRiskScore: modifiedCase.residualRiskScore } : {}),
        ...(modifiedCase.resolvedByName ? { resolvedByName: modifiedCase.resolvedByName } : {}),
        ...(modifiedCase.resolvedByBadge ? { resolvedByBadge: modifiedCase.resolvedByBadge } : {}),
        ...(modifiedCase.resolutionHash ? { resolutionHash: modifiedCase.resolutionHash } : {}),
      });
    }
  } catch (err) {
    console.warn('[CIB-IMS] Firestore sync fallback local:', err);
  }

  return {
    success: true,
    case: modifiedCase,
    message: `Expediente ${codigo} actualizado satisfactoriamente con nueva evaluación de riesgo PxI = ${riskScore}.`,
  };
}

/**
 * Reabrir expediente técnico para nuevos talleres de estudiantes
 */
export async function reopenCaseByCode(codigo: string): Promise<Case> {
  const cases = getStoredCases();
  const index = cases.findIndex((c) => c.codigo.toUpperCase() === codigo.toUpperCase());
  if (index === -1) {
    throw new Error(`Expediente ${codigo} no fue encontrado.`);
  }

  const reopened: Case = {
    ...cases[index],
    status: 'ABIERTO',
    sealedAt: undefined,
    resolutionVerdict: undefined,
    residualProbability: undefined,
    residualImpact: undefined,
    residualRiskScore: undefined,
    resolutionHash: undefined,
    updatedAt: new Date().toISOString(),
  };

  cases[index] = reopened;
  saveStoredCases(cases);

  try {
    if (db && typeof db.app !== 'undefined') {
      const caseDocRef = doc(db, 'cases', codigo);
      await updateDoc(caseDocRef, {
        status: 'ABIERTO',
        sealedAt: null,
        resolutionVerdict: null,
        residualRiskScore: null,
        resolutionHash: null,
        updatedAt: reopened.updatedAt,
      });
    }
  } catch (e) {
    console.warn('[CIB-IMS] Error al sincronizar reapertura en Firestore:', e);
  }

  return reopened;
}

/**
 * Alta y registro de un nuevo incidente forense (siempre inicia en 'ABIERTO')
 */
export async function createNewCase(
  newCaseData: Omit<Case, 'id' | 'riskScore' | 'updatedAt' | 'detectedAt'>
): Promise<Case> {
  const cases = getStoredCases();

  // Validar código único
  if (cases.some((c) => c.codigo.toUpperCase() === newCaseData.codigo.toUpperCase())) {
    throw new Error(`El código institucional [${newCaseData.codigo}] ya está asignado a otro expediente.`);
  }

  const riskScore = newCaseData.probability * newCaseData.impact;
  const now = new Date().toISOString();

  const completeCase: Case = {
    ...newCaseData,
    id: `case-${Date.now()}`,
    status: 'ABIERTO', // Todo nuevo caso inicia abierto
    riskScore,
    detectedAt: now,
    updatedAt: now,
    evidenceCount: newCaseData.evidence?.length || 0,
    daysLoggedCount: newCaseData.timeline?.length || 0,
    evidence: newCaseData.evidence || [],
    timeline: newCaseData.timeline || [],
    interrogations: newCaseData.interrogations || [],
  };

  cases.unshift(completeCase);
  saveStoredCases(cases);

  try {
    if (db && typeof db.app !== 'undefined') {
      const caseDocRef = doc(db, 'cases', completeCase.codigo);
      await setDoc(caseDocRef, completeCase);
    }
  } catch (err) {
    console.warn('[CIB-IMS] Fallback de guardado local para nuevo caso:', err);
  }

  return completeCase;
}

/**
 * Obtener jurisprudencia y marco regulatorio digital
 */
export async function getAllRegulations(): Promise<Regulation[]> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_REGS_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_REGS_KEY, JSON.stringify(INITIAL_REGULATIONS));
    } catch {}
  }
  return INITIAL_REGULATIONS;
}

/**
 * Restablecer datos iniciales oficiales (función de laboratorio para pruebas forenses)
 */
export function resetInstitutionalData(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(INITIAL_CASES));
    localStorage.setItem(STORAGE_REGS_KEY, JSON.stringify(INITIAL_REGULATIONS));
  }
}
