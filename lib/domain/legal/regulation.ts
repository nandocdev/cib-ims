// lib/domain/legal/regulation.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Dominio de Marco Normativo, Jurisprudencia y Cumplimiento Digital

import { z } from 'zod';

export const LegalJurisdictionSchema = z.enum(['PANAMA', 'INTERNACIONAL']);
export type LegalJurisdiction = z.infer<typeof LegalJurisdictionSchema>;

export const RegulationStatusSchema = z.enum(['VIGENTE', 'DEROGADA', 'MODIFICADA', 'EN_PROYECTO']);
export type RegulationStatus = z.infer<typeof RegulationStatusSchema>;

export const KeyArticleSchema = z.object({
  articleNumber: z.string().min(1),
  description: z.string().min(3),
  forensicApplication: z.string().min(3),
});
export type KeyArticle = z.infer<typeof KeyArticleSchema>;

export const LegalRegulationSchema = z.object({
  regulationId: z.string().min(1),
  code: z.string().min(2),
  name: z.string().min(3),
  jurisdiction: LegalJurisdictionSchema,
  promulgationDate: z.string(),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
  version: z.string().default('1.0'),
  status: RegulationStatusSchema.default('VIGENTE'),
  summary: z.string().min(10),
  keyArticles: z.array(KeyArticleSchema).min(1),
  officialLink: z.string().url().nullable().optional(),
});
export type LegalRegulation = z.infer<typeof LegalRegulationSchema>;
