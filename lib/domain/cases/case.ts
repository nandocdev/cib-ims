// lib/domain/cases/case.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Entidad de Dominio y Esquema de Validación de Expediente Forense

import { z } from 'zod';
import { CaseStatusSchema } from './case-status';
import { ProbabilitySchema, ImpactSchema } from '../risk/risk-calculator';

export const CaseClassificationSchema = z.enum(['RESERVADO', 'CONFIDENCIAL', 'SECRETO DE ESTADO']);
export type CaseClassification = z.infer<typeof CaseClassificationSchema>;

export const AttackVectorSchema = z.enum([
  'RANSOMWARE',
  'TROJAN_EXFILTRATION',
  'DDOS_INFRASTRUCTURE',
  'PHISHING_SPEAR',
  'SUPPLY_CHAIN',
  'INSIDER_THREAT',
  'ZERO_DAY_EXPLOIT',
  'API_VULNERABILITY',
  'CLOUD_MISCONFIGURATION',
  'SCADA_ICS_INTRUSION',
  'WATERING_HOLE',
  'AI_PROMPT_INJECTION',
  'SIM_SWAP_FRAUD',
]);
export type AttackVector = z.infer<typeof AttackVectorSchema>;

// Esquema de Artefacto de Evidencia Embebido / Proyectado
export const EvidenceArtifactSchema = z.object({
  id: z.string().min(1),
  evidenceCode: z.string().regex(/^EV-\d{4}-\d{3}-[A-Z0-9]+$/, 'Formato de código de evidencia inválido'),
  name: z.string().min(3).max(200),
  description: z.string().min(5),
  fileType: z.string().min(2),
  fileSize: z.string().min(1),
  hashSha256: z.string().regex(/^[a-fA-F0-9]{64}$/, 'Hash SHA-256 debe contener 64 caracteres hexadecimales'),
  hashMd5: z.string().optional(),
  chainOfCustodyCustodian: z.string().min(3),
  collectionTimestamp: z.string().datetime(),
  extractionLocation: z.string().min(3),
  isCompromised: z.boolean(),
  notes: z.string().optional(),
});
export type EvidenceArtifact = z.infer<typeof EvidenceArtifactSchema>;

// Esquema de Día de Bitácora Forense
export const TimelineDaySchema = z.object({
  dayNumber: z.number().int().min(1).max(5),
  title: z.string().min(3).max(150),
  timestamp: z.string().datetime(),
  leadInvestigator: z.string().min(3),
  actionsTaken: z.array(z.string().min(3)).min(1),
  findings: z.string().min(3),
  telemetryLogs: z.array(z.string()).default([]),
  chainOfCustodyVerified: z.boolean().default(true),
  notes: z.string().optional(),
});
export type TimelineDay = z.infer<typeof TimelineDaySchema>;

// Esquema de Interrogatorio Pericial
export const InterrogationQuestionSchema = z.object({
  id: z.string().min(1),
  questionNumber: z.number().int().min(1),
  questionText: z.string().min(5),
  scenarioContext: z.string().min(3),
  trickTrapDescription: z.string().min(5),
  expectedForensicAnswer: z.string().min(5),
  legalBasis: z.string().min(3),
  difficulty: z.enum(['BASICO', 'INTERMEDIO', 'AVANZADO', 'CRITICO']),
});
export type InterrogationQuestion = z.infer<typeof InterrogationQuestionSchema>;

// Esquema Principal de Caso
export const CaseSchema = z.object({
  id: z.string().min(1),
  codigo: z.string().regex(/^CIB-\d{4}-\d{3}-[A-Z0-9]+$/, 'Formato de código institucional inválido (CIB-AAAA-###-XX)'),
  title: z.string().min(5).max(300),
  operationCodename: z.string().min(3).max(100),
  summary: z.string().min(10).max(4000),
  classification: CaseClassificationSchema,
  status: CaseStatusSchema,
  vector: AttackVectorSchema,
  probability: ProbabilitySchema,
  impact: ImpactSchema,
  riskScore: z.number().int().min(1).max(25),
  leadInvestigatorBadge: z.string().min(2),
  leadInvestigatorEmail: z.string().email(),
  leadInvestigatorName: z.string().min(2),
  targetEntity: z.string().min(2).max(200),
  detectedAt: z.string().datetime(),
  sealedAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime(),
  mitigationMeasures: z.array(z.string()).default([]),
  applicableRegulations: z.array(z.string()).default([]),
  studentMission: z.string().optional(),
  resolutionVerdict: z.string().optional(),
  residualProbability: ProbabilitySchema.optional(),
  residualImpact: ImpactSchema.optional(),
  residualRiskScore: z.number().int().min(1).max(25).optional(),
  resolvedByBadge: z.string().optional(),
  resolvedByName: z.string().optional(),
  resolutionHash: z.string().optional(),
  evidenceCount: z.number().int().nonnegative().optional(),
  daysLoggedCount: z.number().int().nonnegative().optional(),
  evidence: z.array(EvidenceArtifactSchema).optional(),
  timeline: z.array(TimelineDaySchema).optional(),
  interrogations: z.array(InterrogationQuestionSchema).optional(),
});

export type Case = z.infer<typeof CaseSchema>;

export const CreateCaseInputSchema = CaseSchema.omit({
  id: true,
  riskScore: true,
  updatedAt: true,
  detectedAt: true,
  sealedAt: true,
}).extend({
  detectedAt: z.string().datetime().optional(),
});

export type CreateCaseInput = z.infer<typeof CreateCaseInputSchema>;

export const UpdateCaseInputSchema = CaseSchema.partial().omit({
  id: true,
  codigo: true,
});

export type UpdateCaseInput = z.infer<typeof UpdateCaseInputSchema>;
