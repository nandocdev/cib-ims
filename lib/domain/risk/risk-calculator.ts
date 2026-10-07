// lib/domain/risk/risk-calculator.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Dominio Centralizado de Evaluación Cuantitativa de Riesgo Forense (Resolución AIG 18-2026)

import { z } from 'zod';

export const ProbabilitySchema = z.number().int().min(1).max(5);
export const ImpactSchema = z.number().int().min(1).max(5);

export type RiskSeverity = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export interface RiskEvaluation {
  probability: number;
  impact: number;
  score: number;
  severity: RiskSeverity;
  isRedAlert: boolean; // Umbral de alerta roja para PxI >= 20 conforme a Res. AIG 18-2026
  label: string;
}

/**
 * Calcula de manera centralizada el Risk Score derivado exclusivamente de Probabilidad e Impacto
 */
export function calculateRiskScore(probability: number, impact: number): number {
  const p = Math.max(1, Math.min(5, Math.floor(probability)));
  const i = Math.max(1, Math.min(5, Math.floor(impact)));
  return p * i;
}

/**
 * Determina la severidad táctica institucional del riesgo
 */
export function getRiskSeverity(score: number): RiskSeverity {
  if (score >= 20) return 'CRITICO';
  if (score >= 15) return 'ALTO';
  if (score >= 8) return 'MEDIO';
  return 'BAJO';
}

/**
 * Evaluación completa y oficial del riesgo táctico
 */
export function evaluateRisk(probability: number, impact: number): RiskEvaluation {
  const p = Math.max(1, Math.min(5, Math.floor(probability)));
  const i = Math.max(1, Math.min(5, Math.floor(impact)));
  const score = p * i;
  const severity = getRiskSeverity(score);

  return {
    probability: p,
    impact: i,
    score,
    severity,
    isRedAlert: score >= 20,
    label: `P(${p}) × I(${i}) = ${score} [${severity}]`,
  };
}
