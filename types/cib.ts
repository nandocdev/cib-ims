// types/cib.ts
// Buró Cibernético de Investigación (CIB / CSI Cyber) - República de Panamá
// Modelado estricto de tipos de datos forenses e investigación digital

export type UserRole =
  | 'COMISIONADO_DIRECTOR'       // Acceso total institucional y firma ejecutiva
  | 'AGENTE_FORENSE_TECNICO'     // Adquisición, análisis de artefactos y volcado forense
  | 'AUDITOR_LEGAL_NORMATIVO'    // Verificación de cadena de custodia y jurisprudencia
  | 'ANALISTA_DE_RIESGO'         // Cálculo PxI, vectorización de amenazas y mitigación
  | 'OBSERVADOR_CADETE';         // Lectura restringida y módulo simulador

export type CaseClassification = 'RESERVADO' | 'CONFIDENCIAL' | 'SECRETO DE ESTADO';

export type CaseStatus = 'ABIERTO' | 'EN_AUDITORIA' | 'CERRADO';

export type AttackVector =
  | 'RANSOMWARE'
  | 'TROJAN_EXFILTRATION'
  | 'DDOS_INFRASTRUCTURE'
  | 'PHISHING_SPEAR'
  | 'SUPPLY_CHAIN'
  | 'INSIDER_THREAT'
  | 'ZERO_DAY_EXPLOIT'
  | 'API_VULNERABILITY'
  | 'CLOUD_MISCONFIGURATION'
  | 'SCADA_ICS_INTRUSION'
  | 'WATERING_HOLE'
  | 'AI_PROMPT_INJECTION'
  | 'SIM_SWAP_FRAUD';

export interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  badgeNumber: string; // Ej: CIB-001, CIB-104
  role: UserRole;
  rank: string;        // Ej: Comisionado General, Capitán Forense
  department: string;  // Ej: División de Respuesta a Incidentes (DIR), CSIRT Nacional
  active: boolean;
  avatarUrl?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface EvidenceArtifact {
  id: string;
  evidenceCode: string;          // Ej: EV-2026-001-A
  name: string;
  description: string;
  fileType: string;
  fileSize: string;
  hashSha256: string;            // Hash inmutable de integridad forense
  hashMd5?: string;
  chainOfCustodyCustodian: string; // Nombre/Placa del custodio
  collectionTimestamp: string;
  extractionLocation: string;    // Ej: Servidor DC-01, Memoria RAM volcado
  isCompromised: boolean;
  notes?: string;
}

export interface TimelineDay {
  dayNumber: number;             // 1 al 5
  title: string;
  timestamp: string;
  leadInvestigator: string;
  actionsTaken: string[];
  findings: string;
  telemetryLogs: string[];
  chainOfCustodyVerified: boolean;
  notes?: string;
}

export interface InterrogationQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  scenarioContext: string;
  trickTrapDescription: string;  // Detalle de la trampa o pregunta capciosa
  expectedForensicAnswer: string;
  legalBasis: string;            // Referencia a Ley 81, Ley 51, etc.
  difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO' | 'CRITICO';
}

export interface Case {
  id: string;
  codigo: string;                // Código único: Ej: CIB-2026-001-TG
  title: string;
  operationCodename: string;     // Ej: Operación TechGlobe
  summary: string;
  classification: CaseClassification;
  status: CaseStatus;
  vector: AttackVector;
  probability: number;           // Escala 1 a 5
  impact: number;                // Escala 1 a 5
  riskScore: number;             // P * I (1 a 25)
  leadInvestigatorBadge: string;
  leadInvestigatorEmail: string;
  leadInvestigatorName: string;
  targetEntity: string;          // Ej: Red Bancaria Nacional, Autoridad Marítima
  detectedAt: string;
  sealedAt?: string;             // Fecha de cierre formal de cadena de custodia
  updatedAt: string;
  mitigationMeasures: string[];
  applicableRegulations: string[]; // IDs o códigos de regulaciones
  studentMission?: string;        // Misión o consigna forense asignada a los estudiantes
  resolutionVerdict?: string;     // Dictamen pericial final emitido para el cierre
  residualProbability?: number;   // Probabilidad residual post-mitigación (1 a 5)
  residualImpact?: number;        // Impacto residual post-mitigación (1 a 5)
  residualRiskScore?: number;     // Puntaje de riesgo residual mitigado
  resolvedByBadge?: string;       // Placa del oficial o grupo que firma la resolución
  resolvedByName?: string;        // Nombre del perito o estudiante
  resolutionHash?: string;        // Hash SHA-256 criptográfico de integridad del dictamen
  evidenceCount?: number;
  daysLoggedCount?: number;
  // Subcolecciones referenciadas o embebidas para vistas completas
  evidence?: EvidenceArtifact[];
  timeline?: TimelineDay[];
  interrogations?: InterrogationQuestion[];
}

export interface Regulation {
  id: string;
  code: string;                  // Ej: LEY-81-2019
  name: string;
  jurisdiction: 'PANAMA' | 'INTERNACIONAL';
  promulgationDate: string;
  summary: string;
  keyArticles: {
    articleNumber: string;
    description: string;
    forensicApplication: string;
  }[];
  officialLink?: string;
}

export interface InterrogationSessionScore {
  caseCode: string;
  questionId: string;
  userAnswer: string;
  passed: boolean;
  score: number;
  feedback: string;
}
