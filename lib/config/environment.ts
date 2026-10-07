// lib/config/environment.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Configuración Centralizada de Entorno, Modo Operativo y Feature Flags

export type AppEnvironment = 'DEMO' | 'DEVELOPMENT' | 'PRODUCTION';

export interface EnvironmentConfig {
  env: AppEnvironment;
  isDemo: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  allowQuickUserSwitch: boolean;
  allowClientSeeding: boolean;
  enforceStrictServerAuth: boolean;
  requireAuditSignatures: boolean;
  apiUrl: string;
}

const currentEnv: AppEnvironment = (() => {
  const envVar = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV;
  if (envVar === 'production') return 'PRODUCTION';
  if (envVar === 'demo' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return 'DEMO';
  return 'DEVELOPMENT';
})();

export const ENV: EnvironmentConfig = {
  env: currentEnv,
  isDemo: currentEnv === 'DEMO',
  isDevelopment: currentEnv === 'DEVELOPMENT',
  isProduction: currentEnv === 'PRODUCTION',
  // Solo permitir alternador rápido de usuarios en DEMO o DEVELOPMENT explícito
  allowQuickUserSwitch: currentEnv !== 'PRODUCTION',
  // En producción, el sembrado vía cliente o endpoint público está estrictamente deshabilitado
  allowClientSeeding: currentEnv !== 'PRODUCTION',
  enforceStrictServerAuth: currentEnv === 'PRODUCTION',
  requireAuditSignatures: true,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
};
