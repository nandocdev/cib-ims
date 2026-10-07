// scripts/seed-cib.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Script de Sembrado y Aprovisionamiento Forense para Firebase Auth y Cloud Firestore

import { INITIAL_USERS, INITIAL_REGULATIONS, INITIAL_CASES } from '../lib/data/initial-data';
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getAuth, type UserRecord } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

async function runCibSeeder() {
  console.log('================================================================');
  console.log(' [CIB-IMS] INICIANDO SCRIPT DE SEMBRADO Y REGISTRO INSTITUCIONAL ');
  console.log(' REPÚBLICA DE PANAMÁ - BURÓ CIBERNÉTICO DE INVESTIGACIÓN (CSI CYBER)');
  console.log('================================================================\n');

  // Inicializar Firebase Admin con el proyecto y base de datos aprovisionados
  const app = !getApps().length
    ? initializeApp({
        projectId: firebaseConfig.projectId,
      })
    : getApp();

  const auth = getAuth(app);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  const STANDARD_PASSWORD = 'clavesegura123*';

  // 1. Sembrado de 10 Usuarios Institucionales en Firebase Auth y Firestore (/users)
  console.log('--> Fase 1/3: Creando y sincronizando 10 agentes en Firebase Auth & /users...');

  for (const user of INITIAL_USERS) {
    try {
      // Intentar obtener usuario o crearlo si no existe
      let userRecord: UserRecord;
      try {
        userRecord = await auth.getUserByEmail(user.email);
        console.log(`    [AUTH EXISTE] ${user.email} (UID: ${userRecord.uid}) - Actualizando...`);
        await auth.updateUser(userRecord.uid, {
          displayName: user.displayName,
          password: STANDARD_PASSWORD,
          emailVerified: true,
        });
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          userRecord = await auth.createUser({
            uid: user.uid,
            email: user.email,
            emailVerified: true,
            password: STANDARD_PASSWORD,
            displayName: user.displayName,
            disabled: false,
          });
          console.log(`    [AUTH CREADO] ${user.email} (Rol: ${user.role})`);
        } else {
          throw err;
        }
      }

      // Asignar Custom Claims de rol institucional
      await auth.setCustomUserClaims(userRecord.uid, {
        cibRole: user.role,
        badgeNumber: user.badgeNumber,
        department: user.department,
      });

      // Guardar en la colección /users/{userId}
      await db.collection('users').doc(user.uid).set(
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          badgeNumber: user.badgeNumber,
          role: user.role,
          rank: user.rank,
          department: user.department,
          active: user.active,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log(`    [DB /users] Documento guardado para ${user.email}`);
    } catch (err) {
      console.error(`    [ERROR EN USUARIO] ${user.email}:`, err);
    }
  }

  // 2. Sembrado del Catálogo de Regulaciones y Marco Jurídico Digital (/regulations)
  console.log('\n--> Fase 2/3: Sembrando marco normativo nacional e internacional (/regulations)...');
  for (const reg of INITIAL_REGULATIONS) {
    try {
      await db.collection('regulations').doc(reg.code).set(
        {
          code: reg.code,
          name: reg.name,
          jurisdiction: reg.jurisdiction,
          promulgationDate: reg.promulgationDate,
          summary: reg.summary,
          keyArticles: reg.keyArticles,
          officialLink: reg.officialLink || null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log(`    [DB /regulations] ${reg.code}: ${reg.name.substring(0, 45)}...`);
    } catch (err) {
      console.error(`    [ERROR EN REGULACIÓN] ${reg.code}:`, err);
    }
  }

  // 3. Sembrado de Casos Emblemáticos y Subcolecciones (/cases, /evidence, /timeline, /interrogations)
  console.log('\n--> Fase 3/3: Sembrando 3 casos emblemáticos y subcolecciones forenses...');
  for (const caso of INITIAL_CASES) {
    try {
      const caseRef = db.collection('cases').doc(caso.codigo);

      // Documento principal del caso
      await caseRef.set(
        {
          codigo: caso.codigo,
          title: caso.title,
          operationCodename: caso.operationCodename,
          summary: caso.summary,
          classification: caso.classification,
          status: caso.status,
          vector: caso.vector,
          probability: caso.probability,
          impact: caso.impact,
          riskScore: caso.riskScore,
          leadInvestigatorBadge: caso.leadInvestigatorBadge,
          leadInvestigatorEmail: caso.leadInvestigatorEmail,
          leadInvestigatorName: caso.leadInvestigatorName,
          targetEntity: caso.targetEntity,
          detectedAt: caso.detectedAt,
          sealedAt: caso.sealedAt || null,
          updatedAt: caso.updatedAt,
          mitigationMeasures: caso.mitigationMeasures,
          applicableRegulations: caso.applicableRegulations,
          evidenceCount: caso.evidence?.length || 0,
          daysLoggedCount: caso.timeline?.length || 0,
        },
        { merge: true }
      );
      console.log(`    [DB /cases] Caso registrado: ${caso.codigo} | Estado: ${caso.status} | Riesgo: ${caso.riskScore}`);

      // Subcolección: Evidencias forenses
      if (caso.evidence && caso.evidence.length > 0) {
        for (const ev of caso.evidence) {
          await caseRef.collection('evidence').doc(ev.evidenceCode).set(
            {
              evidenceCode: ev.evidenceCode,
              name: ev.name,
              description: ev.description,
              fileType: ev.fileType,
              fileSize: ev.fileSize,
              hashSha256: ev.hashSha256,
              chainOfCustodyCustodian: ev.chainOfCustodyCustodian,
              collectionTimestamp: ev.collectionTimestamp,
              extractionLocation: ev.extractionLocation,
              isCompromised: ev.isCompromised,
              notes: ev.notes || '',
            },
            { merge: true }
          );
        }
        console.log(`        + Subcolección /evidence: ${caso.evidence.length} artefactos sellados.`);
      }

      // Subcolección: Bitácora de 5 Días
      if (caso.timeline && caso.timeline.length > 0) {
        for (const day of caso.timeline) {
          await caseRef.collection('timeline').doc(String(day.dayNumber)).set(
            {
              dayNumber: day.dayNumber,
              title: day.title,
              timestamp: day.timestamp,
              leadInvestigator: day.leadInvestigator,
              actionsTaken: day.actionsTaken,
              findings: day.findings,
              telemetryLogs: day.telemetryLogs,
              chainOfCustodyVerified: day.chainOfCustodyVerified,
            },
            { merge: true }
          );
        }
        console.log(`        + Subcolección /timeline: ${caso.timeline.length} días de bitácora sincronizados.`);
      }

      // Subcolección: Interrogatorios
      if (caso.interrogations && caso.interrogations.length > 0) {
        for (const q of caso.interrogations) {
          await caseRef.collection('interrogations').doc(q.id).set(
            {
              id: q.id,
              questionNumber: q.questionNumber,
              scenarioContext: q.scenarioContext,
              questionText: q.questionText,
              trickTrapDescription: q.trickTrapDescription,
              expectedForensicAnswer: q.expectedForensicAnswer,
              legalBasis: q.legalBasis,
              difficulty: q.difficulty,
            },
            { merge: true }
          );
        }
        console.log(`        + Subcolección /interrogations: ${caso.interrogations.length} reactivos cargados.`);
      }
    } catch (err) {
      console.error(`    [ERROR EN CASO] ${caso.codigo}:`, err);
    }
  }

  console.log('\n================================================================');
  console.log(' [CIB-IMS] PROCESO DE SEMBRADO COMPLETADO EXITOSAMENTE');
  console.log(' Usuario Director de Prueba Maestro: usuario1@cib.gob.pa');
  console.log(' Contraseña de Credenciales:         clavesegura123*');
  console.log('================================================================\n');
}

// Ejecución directa si se invoca desde CLI
if (require.main === module) {
  runCibSeeder()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error fatal en seeder:', err);
      process.exit(1);
    });
}

export { runCibSeeder };
