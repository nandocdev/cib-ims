// lib/firebase/admin.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Configuración Segura de Firebase Admin SDK (Estrictamente Servidor / Server-Only)

import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '@/firebase-applet-config.json';
import { logger } from '@/lib/observability/logger';

// Guardia perimetral: Impedir estrictamente ejecución en navegadores cliente
if (typeof window !== 'undefined') {
  throw new Error('CRITICAL SECURITY VIOLATION: Firebase Admin SDK no debe ejecutarse en el cliente.');
}

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

try {
  if (!getApps().length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountJson) {
      try {
        const credentials = JSON.parse(serviceAccountJson);
        adminApp = initializeApp({
          credential: cert(credentials),
          projectId: credentials.project_id || firebaseConfig.projectId,
        });
      } catch (parseError) {
        logger.error('Error al parsear FIREBASE_SERVICE_ACCOUNT_KEY', undefined, parseError);
        adminApp = initializeApp({
          projectId: firebaseConfig.projectId,
        });
      }
    } else {
      // Uso de Application Default Credentials (ADC) en entorno Google Cloud
      adminApp = initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  } else {
    adminApp = getApp();
  }

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId);
} catch (error) {
  logger.warn('Firebase Admin SDK inicializado en modo fallback offline', undefined, error);
  adminApp = {} as App;
  adminAuth = {} as Auth;
  adminDb = {} as Firestore;
}

export { adminApp, adminAuth, adminDb };
export default adminApp;
