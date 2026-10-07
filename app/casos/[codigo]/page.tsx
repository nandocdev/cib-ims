// app/casos/[codigo]/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Vista de Detalle Profundo del Expediente / Case Dossier Forense
// Módulo Interactivo de Resolución Estudiantil y Clausura de Cadena de Custodia

'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Case } from '@/types/cib';
import { getCaseByCode, updateCaseByCode, reopenCaseByCode } from '@/lib/case-service';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge, ClassificationBadge, RiskBadge } from '@/components/StatusBadge';
import {
  Shield,
  Lock,
  Unlock,
  Edit3,
  Clock,
  User,
  Fingerprint,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertOctagon,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Terminal,
  ShieldAlert,
  Building,
  HelpCircle,
  Target,
  Award,
  Sparkles,
  Send,
  RotateCcw,
  Plus,
  Trash2,
  FileSignature,
  Scale,
  BadgeCheck,
} from 'lucide-react';

// Plantillas sugeridas oficiales de dictamen para los casos abiertos
const SUGGESTED_VERDICTS: Record<string, string> = {
  'CIB-2026-001-TG': `DICTAMEN PERICIAL DE DESCONTAMINACIÓN Y SANEAMIENTO (OPERACIÓN TECHGLOBE):
1. DESCONTAMINACIÓN DE CÓDIGO (GPLv3): Se ejecutó la remoción pericial del módulo binario compilado bajo licencia copyleft GPLv3 (lib_ai_engine.so.bin), reemplazándolo por un componente con licencia permisiva (MIT/Apache 2.0). Esto extingue la obligación legal de liberar el código privativo del producto comercial (Ley 64 de 2012 / Convenio de Berna).
2. SANEAMIENTO PERICIAL DE BIOMETRÍA: Ejecución certificada de borrado seguro irreversible (algoritmo DoD 5220.22-M) sobre las 5,000 imágenes de cédulas y licencias alojadas en el bucket S3 sin consentimiento reforzado, cumpliendo con la Opinión Vinculante ANTAI 002-2022 y Circular MEF 2023-4680.
3. PROTOCOLO TRANSFRONTERIZO: Suspensión de transferencias no autorizadas hacia instancias en Frankfurt hasta formalizar Cláusulas Contractuales Tipo (SCC) auditadas por ANTAI y el RGPD (Art. 3).
4. CONSENTIMIENTO EXPRESO: Implementación de portal de autogestión de consentimiento con sellado temporal NTP inmutable bajo la Ley 51 de 2008.`,

  'CIB-2026-002-PC20': `DICTAMEN PERICIAL DE ERRADICACIÓN Y POLÍTICAS DE ENDPOINT (OPERACIÓN TROJAN-PC20):
1. AISLAMIENTO Y CONTENCIÓN: Se ejecutó el aislamiento pericial de la VLAN 40 (Diseño) y el bloqueo inmediato de tráfico perimetral saliente en puerto 4444 hacia la IP maliciosa del servidor C2 (185.220.101.44).
2. ERRADICACIÓN DE MALWARE: Reinstalación limpia (reimaging) certificada de las 20 estaciones de trabajo comprometidas, erradicando el binario software_gratis.exe y la persistencia en el registro de Windows HKCU\\...\\Run\\WinUpdater.
3. PRIVILEGIOS MÍNIMOS: Despliegue de Directivas de Grupo (GPO) con reglas AppLocker para restringir la ejecución de binarios no firmados y revocación total de privilegios de administrador local a usuarios estándar (CIS Control 5 / ISO 27001).
4. AUDITORÍA DE DERECHOS DE AUTOR: Purga forense de los 35 recursos gráficos con marcas de agua adulteradas en el servidor NAS corporativo y adquisición de licencias comerciales oficiales conforme a la Ley 64 de 2012.`,

  'CIB-2026-003-PE': `DICTAMEN PERICIAL ANTE LA AIG Y MITIGACIÓN DE CADENA DE SUMINISTRO (OPERACIÓN PORTAL-ESTATAL):
1. CONTROLES COMPENSATORIOS INMEDIATOS: Activación de regla de inspección y virtual patching en el WAF bloqueando los vectores de explotación remota (CVE-2025-48812) mientras concluyen las pruebas del parche oficial.
2. NOTIFICACIÓN Y PROTOCOLO CSIRT: Remisión formal del reporte de incidente de nivel crítico a la AIG y al CSIRT Panamá en estricto cumplimiento del Artículo 11 de la Resolución AIG No. 18-2026.
3. REVOCACIÓN DE ACCESOS PRIVILEGIADOS: Cancelación pericial inmediata de las 5 credenciales genéricas de Domain Admin asignadas al contratista externo en el Directorio Activo del Estado.
4. ARQUITECTURA ZERO TRUST / PAM: Implementación mandatoria de solución PAM (Privileged Access Management) con autenticación multifactor física (FIDO2), rotación de contraseñas de un solo uso por sesión y grabación forense inmutable de todas las sesiones de soporte técnico.`,
};

async function computeSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const enc = new TextEncoder().encode(text);
      const hashBuf = await window.crypto.subtle.digest('SHA-256', enc);
      return Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      // Fallback
    }
  }
  return 'cib-' + Math.random().toString(36).substring(2, 12) + Date.now().toString(16);
}

export default function CaseDossierPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [caso, setCaso] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [validatedQuestions, setValidatedQuestions] = useState<Record<string, boolean>>({});

  // Estados del Formulario de Resolución Estudiantil
  const [verdictText, setVerdictText] = useState('');
  const [investigatorName, setInvestigatorName] = useState('');
  const [investigatorBadge, setInvestigatorBadge] = useState('');
  const [residualProb, setResidualProb] = useState<number>(1);
  const [residualImp, setResidualImp] = useState<number>(2);
  const [activeMitigations, setActiveMitigations] = useState<string[]>([]);
  const [newMitigationInput, setNewMitigationInput] = useState('');
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);
  const [resolutionNotice, setResolutionNotice] = useState<string | null>(null);
  const [isReopening, setIsReopening] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCaseByCode(resolvedParams.codigo);
        setCaso(data);
        if (data) {
          setActiveMitigations(data.mitigationMeasures || []);
          setVerdictText(data.resolutionVerdict || '');
          setInvestigatorName(data.resolvedByName || user?.displayName || 'Cadete Forense');
          setInvestigatorBadge(data.resolvedByBadge || user?.badgeNumber || 'CIB-EST-01');
          setResidualProb(data.residualProbability || 1);
          setResidualImp(data.residualImpact || 2);
        }
      } catch (err) {
        console.error('Error al cargar expediente:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.codigo, user]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const toggleQuestionReveal = (qId: string) => {
    setRevealedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleValidateStudentAnswer = (qId: string) => {
    setValidatedQuestions((prev) => ({
      ...prev,
      [qId]: true,
    }));
    setRevealedQuestions((prev) => ({
      ...prev,
      [qId]: true,
    }));
  };

  const handleLoadSuggestedVerdict = () => {
    if (!caso) return;
    const template = SUGGESTED_VERDICTS[caso.codigo];
    if (template) {
      setVerdictText(template);
      setResidualProb(1);
      setResidualImp(2);
    }
  };

  const handleAddMitigation = () => {
    if (newMitigationInput.trim()) {
      setActiveMitigations((prev) => [...prev, newMitigationInput.trim()]);
      setNewMitigationInput('');
    }
  };

  const handleRemoveMitigation = (idx: number) => {
    setActiveMitigations((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleResolveAndSeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caso) return;

    if (!verdictText.trim()) {
      alert('Por favor redacte el Dictamen Pericial de Resolución antes de sellar el expediente.');
      return;
    }

    setIsSubmittingResolution(true);
    setResolutionNotice(null);

    try {
      const calculatedResidual = residualProb * residualImp;
      const stampPayload = `${caso.codigo}:${investigatorBadge}:${verdictText}:${new Date().toISOString()}`;
      const hashSha256 = await computeSha256(stampPayload);

      const result = await updateCaseByCode(caso.codigo, {
        status: 'CERRADO',
        sealedAt: new Date().toISOString(),
        resolutionVerdict: verdictText.trim(),
        residualProbability: residualProb,
        residualImpact: residualImp,
        residualRiskScore: calculatedResidual,
        resolvedByName: investigatorName.trim(),
        resolvedByBadge: investigatorBadge.trim(),
        resolutionHash: hashSha256,
        mitigationMeasures: activeMitigations,
      });

      setCaso(result.case);
      setResolutionNotice(
        `¡EXPEDIENTE ${caso.codigo} RESUELTO EXITOSAMENTE! Cadena de custodia sellada con hash ${hashSha256.substring(0, 16)}...`
      );
      setTimeout(() => setResolutionNotice(null), 6000);
    } catch (err: any) {
      alert(err?.message || 'Error al sellar el expediente.');
    } finally {
      setIsSubmittingResolution(false);
    }
  };

  const handleReopenCase = async () => {
    if (!caso) return;
    if (
      confirm(
        `¿Desea reabrir el expediente [${caso.codigo}] para que un nuevo estudiante o grupo de taller lo resuelva?`
      )
    ) {
      setIsReopening(true);
      try {
        const reopened = await reopenCaseByCode(caso.codigo);
        setCaso(reopened);
        setVerdictText('');
        setResolutionNotice('Expediente reabierto satisfactoriamente en estado ABIERTO para nuevo taller.');
        setTimeout(() => setResolutionNotice(null), 4000);
      } catch (err: any) {
        alert(err?.message || 'Error al reabrir expediente');
      } finally {
        setIsReopening(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono text-slate-400">
        <span className="inline-block w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></span>
        <p>Desencriptando y cargando expediente pericial [{resolvedParams.codigo}]...</p>
      </div>
    );
  }

  if (!caso) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-mono">
        <div className="p-8 rounded-2xl bg-rose-950/40 border border-rose-500/50">
          <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">EXPEDIENTE NO LOCALIZADO</h2>
          <p className="text-sm text-slate-300 mt-2">
            El código pericial [{resolvedParams.codigo}] no existe en la base forense institucional del CIB.
          </p>
          <Link
            href="/casos"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retornar a Expedientes</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOpen = caso.status === 'ABIERTO';
  const residualScore = (caso.residualProbability || residualProb) * (caso.residualImpact || residualImp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navegación y Acciones de Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950 pb-4">
        <Link
          href="/casos"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo de Expedientes</span>
        </Link>

        <div className="flex items-center gap-3">
          {isOpen ? (
            <a
              href="#modulo-resolucion"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 border border-emerald-400/50 transition-all cursor-pointer"
            >
              <FileSignature className="w-4 h-4" />
              <span>Resolver Este Expediente</span>
            </a>
          ) : (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-400">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Expediente Sellado</span>
              </div>
              <button
                onClick={handleReopenCase}
                disabled={isReopening}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
                title="Reabrir expediente para que otro estudiante o grupo lo resuelva"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reabrir para Taller</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notificación Dinámica de Resolución */}
      {resolutionNotice && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center gap-3 animate-in fade-in">
          <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="font-bold">{resolutionNotice}</p>
        </div>
      )}

      {/* Tarjeta Principal del Expediente (Dossier Header) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-b from-[#0c1322] to-[#070b14] border border-cyan-900/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-cyan-400 tracking-wider">
              {caso.codigo}
            </span>
            <ClassificationBadge classification={caso.classification} />
            <StatusBadge status={caso.status} />
          </div>

          <RiskBadge
            probability={caso.probability}
            impact={caso.impact}
            score={caso.riskScore}
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight mb-2">
          {caso.operationCodename}: {caso.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl mb-4">
          {caso.summary}
        </p>

        {caso.studentMission && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 mb-6 font-mono ${
              isOpen
                ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-200 shadow-lg shadow-emerald-950/30'
                : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}
          >
            <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  {isOpen
                    ? '🎯 MISIÓN FORENSE ASIGNADA AL ESTUDIANTE (EXPEDIENTE ABIERTO)'
                    : '📋 PRECEDENTE JURISPRUDENCIAL Y DICTAMEN DE CONSULTA'}
                </p>
                {isOpen && (
                  <a
                    href="#modulo-resolucion"
                    className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold uppercase transition-colors"
                  >
                    Ir a Resolver
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">{caso.studentMission}</p>
            </div>
          </div>
        )}

        {/* Metadatos Tácticos en Rejilla */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-cyan-950 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/40 border border-cyan-950">
            <p className="text-slate-500 flex items-center gap-1.5 mb-1">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              Entidad Afectada:
            </p>
            <p className="text-white font-semibold truncate">{caso.targetEntity}</p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-cyan-950">
            <p className="text-slate-500 flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Investigador Líder:
            </p>
            <p className="text-white font-semibold truncate">
              {caso.leadInvestigatorName} ({caso.leadInvestigatorBadge})
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-cyan-950">
            <p className="text-slate-500 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Detección Inicial:
            </p>
            <p className="text-white font-semibold">
              {new Date(caso.detectedAt).toLocaleString('es-PA')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-cyan-950">
            <p className="text-slate-500 flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              Sellado Forense:
            </p>
            <p className="text-white font-semibold">
              {caso.sealedAt ? new Date(caso.sealedAt).toLocaleString('es-PA') : 'En Curso (Abierto)'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 MÓDULO INTERACTIVO DE RESOLUCIÓN FORENSE Y SELLADO DE CADENA DE CUSTODIA */}
      {/* ========================================================================= */}
      <div id="modulo-resolucion">
        {isOpen ? (
          /* FORMULARIO DE RESOLUCIÓN PARA CASO ABIERTO */
          <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-b from-[#0b172a] to-[#060b14] border-2 border-emerald-500/80 shadow-2xl shadow-emerald-950/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-md">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black font-mono text-white tracking-wide">
                    MÓDULO DE RESOLUCIÓN FORENSE TÁCTICA — TALLER INSTITUCIONAL
                  </h2>
                  <p className="text-xs font-mono text-emerald-400">
                    Unidad Asignada: Formulación de Dictamen, Remediación y Sello Criptográfico
                  </p>
                </div>
              </div>

              {SUGGESTED_VERDICTS[caso.codigo] && (
                <button
                  type="button"
                  onClick={handleLoadSuggestedVerdict}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600 text-xs font-mono font-bold transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Cargar Dictamen Modelo Sugerido</span>
                </button>
              )}
            </div>

            <form onSubmit={handleResolveAndSeal} className="space-y-6 font-mono text-xs">
              {/* 1. Misión Recordatorio */}
              <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-950 text-slate-300 space-y-1">
                <span className="text-[11px] font-bold text-cyan-400 uppercase">
                  Objetivo del Peritaje:
                </span>
                <p className="text-xs text-slate-200">{caso.studentMission}</p>
              </div>

              {/* 2. Redacción del Dictamen */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-white uppercase flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Dictamen Pericial de Resolución y Plan de Remediación:</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Fundamento Técnico y Jurídico</span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={verdictText}
                  onChange={(e) => setVerdictText(e.target.value)}
                  placeholder="Redacte aquí las medidas técnicas, normativas y forenses adoptadas para sanear el incidente, revertir la contaminación de código/datos y mitigar la exposición legal..."
                  className="w-full bg-[#040812] border border-emerald-900/80 rounded-xl p-3.5 text-white leading-relaxed focus:outline-hidden focus:border-emerald-400 placeholder-slate-600"
                />
              </div>

              {/* 3. Reevaluación de la Matriz de Riesgo Residual (P x I) */}
              <div className="p-5 rounded-xl bg-black/60 border border-emerald-950 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-950/60 pb-3">
                  <div>
                    <h3 className="font-bold text-white uppercase flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      <span>Evaluación de Riesgo Residual Post-Mitigación</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Demuestre cuantitativamente la reducción de riesgo tras aplicar los controles de remediación.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Riesgo Inicial:</span>
                      <span className="text-rose-400 font-bold">
                        P({caso.probability}) × I({caso.impact}) = {caso.riskScore}
                      </span>
                    </div>
                    <span className="text-slate-500 font-bold">➜</span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Riesgo Residual:</span>
                      <span className="text-emerald-400 font-bold">
                        P({residualProb}) × I({residualImp}) = {residualProb * residualImp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                  <div>
                    <label className="block text-slate-300 mb-1">
                      Probabilidad Residual de Recurrencia: <span className="text-cyan-400 font-bold">{residualProb}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={residualProb}
                      onChange={(e) => setResidualProb(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>1 (Rara / Controlada)</span>
                      <span>3 (Moderada)</span>
                      <span>5 (Casi Segura)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">
                      Impacto Residual Mitigado: <span className="text-emerald-400 font-bold">{residualImp}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={residualImp}
                      onChange={(e) => setResidualImp(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>1 (Insignificante)</span>
                      <span>2 (Bajo / Contenido)</span>
                      <span>5 (Catastrófico)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Lista de Medidas de Mitigación Implementadas */}
              <div>
                <label className="block font-bold text-white mb-2 uppercase">
                  Medidas de Contención y Remediación Táctica Aplicadas:
                </label>
                <div className="space-y-2 mb-3">
                  {activeMitigations.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-emerald-950 text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{m}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMitigation(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remover medida"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMitigationInput}
                    onChange={(e) => setNewMitigationInput(e.target.value)}
                    placeholder="Añadir medida de mitigación adicional..."
                    className="flex-1 bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMitigation}
                    className="px-3 py-2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg hover:bg-cyan-900 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 5. Identificación del Perito y Sellado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-cyan-950">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Nombre del Estudiante / Perito Responsable:
                  </label>
                  <input
                    type="text"
                    required
                    value={investigatorName}
                    onChange={(e) => setInvestigatorName(e.target.value)}
                    placeholder="Ej: Lic. Carlos Gómez / Grupo 1"
                    className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Matrícula o Placa Forense:
                  </label>
                  <input
                    type="text"
                    required
                    value={investigatorBadge}
                    onChange={(e) => setInvestigatorBadge(e.target.value)}
                    placeholder="Ej: CIB-EST-01 / GRUPO-1"
                    className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* Botón de Envío y Sellado Definitivo */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-950/80">
                <p className="text-[11px] text-slate-400">
                  Al emitir el dictamen, el expediente transicionará a <strong>CERRADO</strong> con sello inmutable bajo la Ley 51 de 2008.
                </p>

                <button
                  type="submit"
                  disabled={isSubmittingResolution}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/80 border border-emerald-400 cursor-pointer disabled:opacity-50"
                >
                  <Award className="w-4 h-4" />
                  <span>
                    {isSubmittingResolution
                      ? 'Sellando y Generando Hash...'
                      : 'Emitir Dictamen Final y Sellar Expediente'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* CERTIFICADO OFICIAL DE EXPEDIENTE SELLADO (CERRADO) */
          <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-b from-[#0e1628] to-[#080d19] border-2 border-cyan-500/80 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-950 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400 shadow-lg">
                  <BadgeCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black font-mono text-white tracking-wide">
                      CERTIFICADO OFICIAL DE RESOLUCIÓN Y CLAUSURA PERICIAL
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-700">
                      SELLADO
                    </span>
                  </div>
                  <p className="text-xs font-mono text-cyan-400">
                    Cadena de Custodia Inmutable Criptográfica — Buró Cibernético de Investigación
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReopenCase}
                  disabled={isReopening}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold transition-all cursor-pointer"
                  title="Reabrir este caso para que un nuevo estudiante lo resuelva"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reabrir para Nuevo Taller</span>
                </button>
              </div>
            </div>

            {/* Hash Criptográfico del Cierre */}
            <div className="p-3.5 rounded-xl bg-[#040814] border border-cyan-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 overflow-hidden">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-400 font-bold">SELLO SHA-256:</span>
                <span className="text-emerald-400 font-mono select-all truncate">
                  {caso.resolutionHash || 'cib-hash-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </span>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">
                Clausura: {caso.sealedAt ? new Date(caso.sealedAt).toLocaleString('es-PA') : 'Registrada'}
              </span>
            </div>

            {/* Dictamen Pericial Oficial */}
            <div className="space-y-2 font-mono">
              <h3 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>Dictamen Pericial de Clausura y Veredicto Técnico:</span>
              </h3>
              <div className="p-4 rounded-xl bg-black/60 border border-cyan-950 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {caso.resolutionVerdict ||
                  caso.studentMission ||
                  'Expediente debidamente cerrado conforme al estándar forense nacional e internacional.'}
              </div>
            </div>

            {/* Comparativa de Mitigación de Riesgo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-950">
                <span className="text-slate-500 block mb-1">Riesgo Inicial Evaluado:</span>
                <span className="text-rose-400 font-bold text-sm">
                  P({caso.probability}) × I({caso.impact}) = {caso.riskScore} (CRÍTICO)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-950">
                <span className="text-slate-500 block mb-1">Riesgo Residual Mitigado:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  P({caso.residualProbability || 1}) × I({caso.residualImpact || 2}) = {caso.residualRiskScore || 2} (BAJO)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-cyan-950">
                <span className="text-slate-500 block mb-1">Perito / Evaluador:</span>
                <span className="text-white font-bold text-sm truncate block">
                  {caso.resolvedByName || caso.leadInvestigatorName} ({caso.resolvedByBadge || caso.leadInvestigatorBadge})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MEDIDAS DE CONTENCIÓN Y MARCO NORMATIVO APLICABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medidas de Mitigación */}
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-cyan-900/40">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Medidas de Mitigación y Respuesta Táctica ({caso.mitigationMeasures?.length || 0})
            </h2>
          </div>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            {caso.mitigationMeasures.map((med, i) => (
              <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-black/30 border border-cyan-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{med}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Regulaciones y Jurisprudencia Invocada */}
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-cyan-900/40">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Fundamentos Jurídicos Vinculados
            </h2>
          </div>
          <div className="space-y-2 text-xs font-mono">
            {caso.applicableRegulations.map((regCode) => (
              <div
                key={regCode}
                className="p-3 rounded-lg bg-black/30 border border-cyan-950 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  <span>{regCode}</span>
                </div>
                <Link
                  href="/jurisprudencia"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                >
                  Consultar Artículo
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: ARTEFACTOS DE EVIDENCIA FORENSE (SUBCOLECCIÓN /evidence) */}
      <div className="p-6 rounded-2xl bg-[#090e1a] border border-cyan-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
              Artefactos de Evidencia Digital ({caso.evidence?.length || 0})
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cadena de Custodia SHA-256 Verificada
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {caso.evidence?.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-xl bg-black/40 border border-cyan-950 hover:border-cyan-800/80 transition-all font-mono text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-950/60 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-xs border border-cyan-800">
                    {ev.evidenceCode}
                  </span>
                  <span className="text-white font-bold text-sm">{ev.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Tipo: {ev.fileType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    Tamaño: {ev.fileSize}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 text-xs">{ev.description}</p>

              {/* Hash Forense Criptográfico Inmutable */}
              <div className="p-2.5 rounded-lg bg-[#040710] border border-cyan-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase shrink-0">
                    SHA-256 Hash:
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 truncate select-all">
                    {ev.hashSha256}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(ev.hashSha256, ev.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedHash === ev.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Hash</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1">
                <div>
                  <span className="text-slate-500">Custodio Forense:</span>{' '}
                  <span className="text-slate-200">{ev.chainOfCustodyCustodian}</span>
                </div>
                <div>
                  <span className="text-slate-500">Ubicación de Extracción:</span>{' '}
                  <span className="text-slate-200">{ev.extractionLocation}</span>
                </div>
                <div>
                  <span className="text-slate-500">Fecha Incautación:</span>{' '}
                  <span className="text-slate-200">
                    {new Date(ev.collectionTimestamp).toLocaleString('es-PA')}
                  </span>
                </div>
              </div>

              {ev.notes && (
                <div className="p-2 rounded bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300">
                  <strong>Nota Pericial:</strong> {ev.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: BITÁCORA OPERATIVA DE 5 DÍAS (SUBCOLECCIÓN /timeline) */}
      <div className="p-6 rounded-2xl bg-[#090e1a] border border-cyan-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
              Bitácora Cronológica de 5 Días (Forense Timeline)
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {caso.timeline?.length || 0} Días Asentados
          </span>
        </div>

        <div className="space-y-4">
          {caso.timeline?.map((day) => (
            <div
              key={day.dayNumber}
              className="p-5 rounded-xl bg-black/40 border border-cyan-950 font-mono text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-950/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center justify-center font-bold text-xs">
                    {day.dayNumber}
                  </span>
                  <span className="text-white font-bold text-sm">{day.title}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <span>Oficial a Cargo: {day.leadInvestigator}</span> •{' '}
                  <span>{new Date(day.timestamp).toLocaleString('es-PA')}</span>
                </div>
              </div>

              <div>
                <p className="text-slate-400 font-semibold mb-1">Acciones Operativas Realizadas:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  {day.actionsTaken.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-900/40">
                <p className="text-cyan-400 font-bold mb-0.5">Hallazgos Periciales Clave:</p>
                <p className="text-slate-200">{day.findings}</p>
              </div>

              {day.telemetryLogs && day.telemetryLogs.length > 0 && (
                <div>
                  <p className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Registros Crudos de Telemetría:
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#04060c] border border-cyan-950 text-[10px] text-emerald-400 font-mono space-y-1 overflow-x-auto">
                    {day.telemetryLogs.map((log, i) => (
                      <div key={i} className="truncate">
                        &gt; {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 3: INTERROGATORIOS Y PREGUNTAS CAPCIOSAS (SUBCOLECCIÓN /interrogations) */}
      <div className="p-6 rounded-2xl bg-[#090e1a] border border-cyan-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
              Interrogatorio Pericial y Preguntas Capciosas ({caso.interrogations?.length || 0})
            </h2>
          </div>
          <span className="text-xs font-mono text-amber-400">
            Formación Táctica & Control de Garantías
          </span>
        </div>

        <div className="space-y-4">
          {caso.interrogations?.map((q) => {
            const isRevealed = revealedQuestions[q.id];
            const studentText = userAnswers[q.id] || '';
            const isValidated = validatedQuestions[q.id];

            return (
              <div
                key={q.id}
                className="p-5 rounded-xl bg-black/40 border border-cyan-950 font-mono text-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-cyan-950/60 pb-2">
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800 text-xs">
                    Pregunta #{q.questionNumber} • Nivel: {q.difficulty}
                  </span>
                  <span className="text-slate-400 text-[11px]">{q.scenarioContext}</span>
                </div>

                <div className="text-sm font-bold text-white leading-relaxed">
                  &ldquo;{q.questionText}&rdquo;
                </div>

                {/* Input para el estudiante antes de revelar la trampa */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] text-slate-400 block font-semibold">
                    Argumento o respuesta técnica del estudiante:
                  </label>
                  <textarea
                    rows={2}
                    value={studentText}
                    onChange={(e) =>
                      setUserAnswers((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                      }))
                    }
                    placeholder="Escriba su criterio técnico-jurídico antes de verificar la trampa forense..."
                    className="w-full bg-[#050914] border border-cyan-950 rounded-lg p-2.5 text-white text-xs placeholder-slate-600 focus:outline-hidden focus:border-cyan-400"
                  />
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleValidateStudentAnswer(q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Contrastar con Criterio Institucional</span>
                  </button>

                  <button
                    onClick={() => toggleQuestionReveal(q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    {isRevealed ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Ocultar Análisis de la Trampa</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Revelar Análisis sin Escribir</span>
                      </>
                    )}
                  </button>
                </div>

                {isRevealed && (
                  <div className="p-4 rounded-xl bg-[#09101d] border border-cyan-800/80 space-y-3 mt-3 animate-in fade-in-50">
                    {studentText && isValidated && (
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs">
                        <strong className="text-cyan-400">Tu Criterio Registrado:</strong> &ldquo;{studentText}&rdquo;
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-amber-200">
                      <p className="font-bold text-amber-300 mb-1">
                        ⚠️ Análisis de la Pregunta Capciosa / Trampa:
                      </p>
                      <p className="text-xs leading-relaxed">{q.trickTrapDescription}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/60 text-emerald-200">
                      <p className="font-bold text-emerald-300 mb-1">
                        ✓ Respuesta Forense Esperada (Estándar Pericial):
                      </p>
                      <p className="text-xs leading-relaxed">{q.expectedForensicAnswer}</p>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Fundamento Normativo:</strong> {q.legalBasis}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
