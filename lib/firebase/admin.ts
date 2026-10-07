// lib/firebase/admin.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Configuración Modular de Firebase Admin SDK para Node.js / Server Actions / Seeder

import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

// Reutilizar instancia o inicializar de forma segura
let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

try {
  if (!getApps().length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountJson) {
      const credentials = JSON.parse(serviceAccountJson);
      adminApp = initializeApp({
        credential: cert(credentials),
        projectId: credentials.project_id || firebaseConfig.projectId,
      });
    } else {
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
  console.warn('[CIB-IMS] Firebase Admin SDK fallback init:', error);
  adminApp = {} as App;
  adminAuth = {} as Auth;
  adminDb = {} as Firestore;
}

export { adminApp, adminAuth, adminDb };
export default adminApp;
