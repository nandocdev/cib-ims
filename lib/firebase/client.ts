// lib/firebase/client.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Configuración Modular del SDK de Cliente Firebase (Auth & Cloud Firestore)

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  /* CRITICAL: Passing firestoreDatabaseId is mandatory for provisioned Firestore */
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);

  // Validación de conexión según Skill Guide
  if (typeof window !== 'undefined') {
    getDocFromServer(doc(db, 'test', 'connection')).catch((error) => {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error('[CIB-IMS] Compruebe la configuración de red y conexión con Firestore.');
      }
    });
  }
} catch (err) {
  console.warn('[CIB-IMS] Firebase client initialized with fallback:', err);
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { app, auth, db, firebaseConfig };

/**
 * Manejador centralizado de errores de Firestore para cumplir con la especificación de seguridad
 * y trazabilidad de permisos forenses.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const currentAuth = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.uid || null,
      email: currentAuth?.email || null,
      emailVerified: currentAuth?.emailVerified || false,
      isAnonymous: currentAuth?.isAnonymous || false,
      tenantId: currentAuth?.tenantId || null,
      providerInfo:
        currentAuth?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };

  console.error('[CIB Forensics] Firestore Security Violation / Error: ', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}
