// app/casos/[codigo]/editar/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Formulario de Edición Técnica Forense y Modificación Restringida por Estado

'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Case, AttackVector, CaseClassification, CaseStatus } from '@/types/cib';
import { getCaseByCode, updateCaseByCode } from '@/lib/case-service';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge, ClassificationBadge, RiskBadge } from '@/components/StatusBadge';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  HelpCircle,
  Shield,
  Plus,
  Trash2,
  Target,
} from 'lucide-react';

export default function EditCasePage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [caso, setCaso] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Campos editables
  const [title, setTitle] = useState('');
  const [operationCodename, setOperationCodename] = useState('');
  const [summary, setSummary] = useState('');
  const [targetEntity, setTargetEntity] = useState('');
  const [vector, setVector] = useState<AttackVector>('RANSOMWARE');
  const [classification, setClassification] = useState<CaseClassification>('CONFIDENCIAL');
  const [status, setStatus] = useState<CaseStatus>('ABIERTO');
  const [probability, setProbability] = useState<number>(3);
  const [impact, setImpact] = useState<number>(3);
  const [mitigations, setMitigations] = useState<string[]>([]);
  const [newMitigation, setNewMitigation] = useState('');
  const [resolutionVerdict, setResolutionVerdict] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const found = await getCaseByCode(resolvedParams.codigo);
        if (found) {
          setCaso(found);
          setTitle(found.title);
          setOperationCodename(found.operationCodename);
          setSummary(found.summary);
          setTargetEntity(found.targetEntity);
          setVector(found.vector);
          setClassification(found.classification);
          setStatus(found.status);
          setProbability(found.probability);
          setImpact(found.impact);
          setMitigations(found.mitigationMeasures || []);
          setResolutionVerdict(found.resolutionVerdict || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.codigo]);

  // Cálculo en vivo de P x I
  const calculatedRisk = probability * impact;

  const handleAddMitigation = () => {
    if (newMitigation.trim()) {
      setMitigations([...mitigations, newMitigation.trim()]);
      setNewMitigation('');
    }
  };

  const handleRemoveMitigation = (idx: number) => {
    setMitigations(mitigations.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!caso) return;

    // VALIDACIÓN DE SEGURIDAD EN EL CLIENTE Y SERVIDOR:
    // Solo permitido si el caso actualmente se encuentra en 'ABIERTO'.
    if (caso.status !== 'ABIERTO') {
      setErrorMsg(
        `VIOLACIÓN DE CADENA DE CUSTODIA FORENSE: El expediente [${caso.codigo}] se encuentra sellado en estado '${caso.status}'. Ningún usuario, inclusive Comisionado Director, puede alterar la evidencia digital una vez cerrada (Ley 51 de 2008).`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateCaseByCode(
        caso.codigo,
        {
          title,
          operationCodename,
          summary,
          targetEntity,
          vector,
          classification,
          status,
          probability,
          impact,
          mitigationMeasures: mitigations,
          ...(resolutionVerdict ? { resolutionVerdict } : {}),
        },
        user?.role
      );

      setSuccessMsg(result.message || 'Expediente actualizado satisfactoriamente.');

      // Si el usuario selló el caso a CERRADO o EN_AUDITORIA, redirigir al dossier
      if (status !== 'ABIERTO') {
        setTimeout(() => {
          router.push(`/casos/${caso.codigo}`);
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al persistir cambios en el expediente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono text-slate-400">
        <span className="inline-block w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></span>
        <p>Verificando permisos y estado de custodia del expediente...</p>
      </div>
    );
  }

  if (!caso) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-mono">
        <div className="p-8 rounded-2xl bg-rose-950/40 border border-rose-500/50">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">EXPEDIENTE NO ENCONTRADO</h2>
          <p className="text-sm text-slate-300 mt-2">
            El código solicitado no corresponde a ningún caso activo.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl bg-cyan-700 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Tablero</span>
          </Link>
        </div>
      </div>
    );
  }

  // BLOQUEO ESTRICTO SI EL CASO NO ESTÁ EN ESTADO 'ABIERTO':
  // Protege contra usuarios que intenten forzar la URL directamente en el navegador.
  if (caso.status !== 'ABIERTO') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 font-mono">
        <div className="p-8 rounded-2xl bg-linear-to-b from-[#1c080d] to-[#0a0406] border-2 border-rose-600 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-950 border border-rose-500 flex items-center justify-center mx-auto text-rose-400 shadow-lg shadow-rose-950/80 animate-pulse">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-700 text-xs font-bold uppercase tracking-wider">
            ACCESO BLOQUEADO POR PROTOCOLO FORENSE
          </div>

          <h1 className="text-2xl font-black text-white">
            VIOLACIÓN DE CADENA DE CUSTODIA (EXPEDIENTE SELLADO)
          </h1>

          <p className="text-xs text-rose-200/90 leading-relaxed max-w-xl mx-auto">
            El expediente <strong className="text-white underline">{caso.codigo}</strong> se encuentra en estado{' '}
            <strong className="text-rose-400 font-bold uppercase">{caso.status}</strong>.
            Conforme a la <strong>Ley 51 de 2008</strong> y la <strong>Resolución AIG No. 18-2026</strong>, los expedientes sellados gozan de presunción de inmutabilidad procesal probatoria.
            La edición técnica está estrictamente deshabilitada.
          </p>

          <div className="p-4 rounded-xl bg-black/60 border border-rose-950 text-left text-xs text-slate-300 space-y-1">
            <p><strong>Código de Incidente:</strong> {caso.codigo}</p>
            <p><strong>Operación:</strong> {caso.operationCodename}</p>
            <p><strong>Estado Actual:</strong> {caso.status}</p>
            <p><strong>Fecha de Sellado:</strong> {caso.sealedAt ? new Date(caso.sealedAt).toLocaleString('es-PA') : 'No registrada'}</p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href={`/casos/${caso.codigo}`}
              className="px-5 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-xs font-bold transition-all"
            >
              Consultar Expediente en Modo Lectura
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all"
            >
              Regresar al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CASO EN ESTADO 'ABIERTO': Formulario de edición pericial habilitado
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-cyan-950 pb-4">
        <Link
          href={`/casos/${caso.codigo}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancelar y Volver al Expediente</span>
        </Link>

        <div className="flex items-center gap-2">
          <StatusBadge status={caso.status} />
          <ClassificationBadge classification={caso.classification} />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#090e1a] border border-cyan-900/60 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-black font-mono text-white">
            EDICIÓN TÉCNICA Y AUDITORÍA DEL EXPEDIENTE [{caso.codigo}]
          </h1>
        </div>
        <p className="text-xs font-mono text-slate-400 mb-6">
          Modificación pericial permitida únicamente mientras el caso permanezca en estado ABIERTO.
        </p>

        {caso.studentMission && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/70 text-emerald-200 text-xs font-mono shadow-md">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>🎯 MISIÓN FORENSE ASIGNADA PARA RESOLUCIÓN:</span>
            </div>
            <p className="text-slate-200 leading-relaxed">{caso.studentMission}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-mono flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">ERROR DE AUDITORÍA FORENSE</p>
              <p className="mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">ACTUALIZACIÓN EXITOSA</p>
              <p className="mt-1">{successMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
          {/* Nombre de Operación y Título */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Nombre Clave de la Operación:
              </label>
              <input
                type="text"
                value={operationCodename}
                onChange={(e) => setOperationCodename(e.target.value)}
                required
                className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Entidad u Organización Afectada:
              </label>
              <input
                type="text"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                required
                className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Título Técnico del Incidente:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Resumen Ejecutivo y Factual:
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Vectores y Clasificación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Vector de Ataque:
              </label>
              <select
                value={vector}
                onChange={(e) => setVector(e.target.value as AttackVector)}
                className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
              >
                <option value="RANSOMWARE">RANSOMWARE</option>
                <option value="TROJAN_EXFILTRATION">TROJAN_EXFILTRATION</option>
                <option value="DDOS_INFRASTRUCTURE">DDOS_INFRASTRUCTURE</option>
                <option value="PHISHING_SPEAR">PHISHING_SPEAR</option>
                <option value="SUPPLY_CHAIN">SUPPLY_CHAIN</option>
                <option value="INSIDER_THREAT">INSIDER_THREAT</option>
                <option value="ZERO_DAY_EXPLOIT">ZERO_DAY_EXPLOIT</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Nivel de Clasificación Institucional:
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as CaseClassification)}
                className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
              >
                <option value="RESERVADO">RESERVADO</option>
                <option value="CONFIDENCIAL">CONFIDENCIAL</option>
                <option value="SECRETO DE ESTADO">SECRETO DE ESTADO</option>
              </select>
            </div>
          </div>

          {/* Evaluación Cuantitativa de Riesgo P x I */}
          <div className="p-4 rounded-xl bg-black/40 border border-cyan-950 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white uppercase">
                  Matriz de Evaluación de Riesgo Táctico (P × I)
                </p>
                <p className="text-[11px] text-slate-400">
                  Cálculo automático de severidad conforme a la Resolución AIG 18-2026.
                </p>
              </div>
              <RiskBadge probability={probability} impact={impact} score={calculatedRisk} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-300 mb-1">
                  Probabilidad de Ocurrencia (1 a 5): <span className="text-cyan-400 font-bold">{probability}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 (Rara)</span>
                  <span>3 (Moderada)</span>
                  <span>5 (Casi Segura)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Impacto en la Entidad (1 a 5): <span className="text-rose-400 font-bold">{impact}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 (Insignificante)</span>
                  <span>3 (Moderado)</span>
                  <span>5 (Catastrófico)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medidas de Mitigación */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Medidas de Mitigación Implementadas:
            </label>
            <div className="space-y-2 mb-3">
              {mitigations.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-cyan-950 text-slate-200"
                >
                  <span>{m}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMitigation(i)}
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
                value={newMitigation}
                onChange={(e) => setNewMitigation(e.target.value)}
                placeholder="Añadir nueva medida de contención..."
                className="flex-1 bg-[#040812] border border-cyan-900 rounded-lg p-2 text-white"
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

          {/* Dictamen Pericial de Resolución / Cierre */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Dictamen Pericial de Resolución / Cierre (Veredicto Técnico):
            </label>
            <textarea
              rows={4}
              value={resolutionVerdict}
              onChange={(e) => setResolutionVerdict(e.target.value)}
              placeholder="Especifique el dictamen técnico, medidas de descontaminación o saneamiento para la resolución..."
              className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Transición de Estado y Sellado Forense */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/60 space-y-2">
            <label className="block font-bold text-amber-300">
              Control de Estado y Cadena de Custodia:
            </label>
            <p className="text-[11px] text-amber-200/80">
              ADVERTENCIA: Si transiciona este expediente a <strong>&quot;CERRADO&quot;</strong> o <strong>&quot;EN AUDITORÍA&quot;</strong>, se aplicará el sello criptográfico inmutable. Cualquier intento futuro de edición será denegado por las reglas del Buró.
            </p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              className="w-full bg-[#040812] border border-amber-800/80 rounded-lg p-2.5 text-white font-bold"
            >
              <option value="ABIERTO">ABIERTO (Continuar peritaje activo)</option>
              <option value="EN_AUDITORIA">EN AUDITORÍA (Bloquea edición técnica)</option>
              <option value="CERRADO">CERRADO (Sellado definitivo de cadena de custodia)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-950">
            <Link
              href={`/casos/${caso.codigo}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/60 border border-cyan-400/40 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando en Búnker...' : 'Guardar y Asentar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
