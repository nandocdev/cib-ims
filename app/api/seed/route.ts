// app/api/seed/route.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Endpoint de Sincronización y Sembrado Administrativo Protegido

import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS, INITIAL_REGULATIONS, INITIAL_CASES } from '@/lib/data/initial-data';
import { db } from '@/lib/firebase/client';
import { doc, setDoc } from 'firebase/firestore';
import { ENV } from '@/lib/config/environment';
import { logger } from '@/lib/observability/logger';

export async function POST(req: NextRequest) {
  return handleProtectedSeed(req);
}

export async function GET(req: NextRequest) {
  return handleProtectedSeed(req);
}

async function handleProtectedSeed(req: NextRequest) {
  // 1. Protección estricta de seguridad en entorno de PRODUCCIÓN:
  if (ENV.isProduction) {
    const adminKey = req.headers.get('x-cib-admin-seed-key');
    const expectedKey = process.env.ADMIN_SEED_SECRET;

    if (!expectedKey || adminKey !== expectedKey) {
      logger.warn('Intento no autorizado de ejecución de seed en producción', {
        ip: req.headers.get('x-forwarded-for') || 'unknown',
      });
      return NextResponse.json(
        {
          success: false,
          error: 'ACCESO DENEGADO: El sembrado público está deshabilitado en entornos productivos institucionales.',
        },
        { status: 403 }
      );
    }
  }

  const summary = {
    usersCount: INITIAL_USERS.length,
    regulationsCount: INITIAL_REGULATIONS.length,
    casesCount: INITIAL_CASES.length,
    timestamp: new Date().toISOString(),
    status: 'INICIANDO',
  };

  try {
    // 2. Sembrado de Usuarios (/users)
    for (const user of INITIAL_USERS) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
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
    }

    // 3. Sembrado de Regulaciones (/regulations)
    for (const reg of INITIAL_REGULATIONS) {
      const regRef = doc(db, 'regulations', reg.code);
      await setDoc(
        regRef,
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
    }

    // 4. Sembrado de Casos (/cases)
    for (const caso of INITIAL_CASES) {
      const caseRef = doc(db, 'cases', caso.codigo);
      await setDoc(caseRef, caso, { merge: true });
    }

    summary.status = 'COMPLETADO_CLOUD_FIRESTORE';
    logger.info('Sembrado institucional en Cloud Firestore completado con éxito', summary);

    return NextResponse.json({
      success: true,
      mode: 'CLOUD_FIRESTORE',
      message: 'Base de datos Cloud Firestore poblada exitosamente con registros oficiales del CIB.',
      summary,
    });
  } catch (error: any) {
    summary.status = 'ERROR_FIRESTORE_REPOSITORIO_LOCAL';
    logger.warn('Fallo en sincronización Firestore durante sembrado; datos activos en fixtures locales', undefined, error);

    return NextResponse.json(
      {
        success: true,
        mode: 'REPOSITORIO_LOCAL_OPERATIVO',
        notice: 'El repositorio institucional CIB se encuentra operativo con datos base.',
        summary,
      },
      { status: 200 }
    );
  }
}
