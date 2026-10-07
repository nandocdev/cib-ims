// app/casos/nuevo/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Alta y Registro de Nuevos Incidentes Forenses Digitales

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Case, AttackVector, CaseClassification } from '@/types/cib';
import { createNewCase } from '@/lib/case-service';
import { useAuth } from '@/context/AuthContext';
import { RiskBadge } from '@/components/StatusBadge';
import {
  PlusCircle,
  ArrowLeft,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Building,
  Terminal,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react';

export default function NuevoCasoPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [codigo, setCodigo] = useState('CIB-2026-004-OP');
  const [operationCodename, setOperationCodename] = useState('Operación Centinela-Panamá');
  const [title, setTitle] = useState('');
  const [targetEntity, setTargetEntity] = useState('');
  const [summary, setSummary] = useState('');
  const [vector, setVector] = useState<AttackVector>('PHISHING_SPEAR');
  const [classification, setClassification] = useState<CaseClassification>('CONFIDENCIAL');
  const [probability, setProbability] = useState<number>(3);
  const [impact, setImpact] = useState<number>(4);
  const [mitigations, setMitigations] = useState<string[]>([
    'Aislamiento de terminales comprometidas de la red corporativa.',
    'Captura de tráfico en puntos perimetrales para detección de dominios C2.',
  ]);
  const [newMitigation, setNewMitigation] = useState('');
  const [applicableRegs, setApplicableRegs] = useState<string[]>([
    'LEY-81-2019',
    'LEY-51-2008',
    'RES-AIG-18-2026',
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    setIsSubmitting(true);

    try {
      const created = await createNewCase({
        codigo: codigo.trim().toUpperCase(),
        title: title.trim(),
        operationCodename: operationCodename.trim(),
        summary: summary.trim(),
        classification,
        status: 'ABIERTO', // Regla de negocio: Todo nuevo caso inicia abierto
        vector,
        probability,
        impact,
        leadInvestigatorBadge: user?.badgeNumber || 'CIB-001-DIR',
        leadInvestigatorEmail: user?.email || 'usuario1@cib.gob.pa',
        leadInvestigatorName: user?.displayName || 'Comisionado Rafael Mendoza',
        targetEntity: targetEntity.trim(),
        mitigationMeasures: mitigations,
        applicableRegulations: applicableRegs,
      });

      router.push(`/casos/${created.codigo}`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al asentar el expediente pericial.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-cyan-950 pb-4">
        <Link
          href="/casos"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Repositorio General</span>
        </Link>
        <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-600/50">
          ESTADO INICIAL: ABIERTO
        </span>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-[#090e1a] border border-cyan-900/60 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <PlusCircle className="w-6 h-6 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-black font-mono text-white">
            ALTA Y REGISTRO DE NUEVO INCIDENTE FORENSE
          </h1>
        </div>
        <p className="text-xs font-mono text-slate-400 mb-6">
          Oficial actuante: <strong className="text-cyan-300">{user?.displayName}</strong> ({user?.badgeNumber}) • República de Panamá
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-mono flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">ERROR EN REGISTRO DE EXPEDIENTE</p>
              <p className="mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
          {/* Identificadores Oficiales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Código Pericial Institucional (Único):
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                placeholder="CIB-2026-004-XX"
                className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white font-bold text-cyan-300 focus:outline-hidden focus:border-cyan-400 uppercase"
              />
              <span className="text-[10px] text-slate-500">Formato estándar: CIB-AÑO-NUM-SUFIJO</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Nombre Clave de Operación Táctica:
              </label>
              <input
                type="text"
                value={operationCodename}
                onChange={(e) => setOperationCodename(e.target.value)}
                required
                placeholder="Operación NombreClave"
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
              placeholder="Ej: Ataque de Spear Phishing con Carga Útil Infostealer en Autoridad Gubernamental"
              className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Entidad u Organización Blanco:
            </label>
            <input
              type="text"
              value={targetEntity}
              onChange={(e) => setTargetEntity(e.target.value)}
              required
              placeholder="Ej: Autoridad Nacional de Aduanas / Banco Nacional de Panamá"
              className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Resumen Factual del Incidente (Narrativa Pericial):
            </label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              placeholder="Describa la cronología de detección, telemetría inicial, indicadores de compromiso (IoC) y primeros indicios forenses..."
              className="w-full bg-[#040812] border border-cyan-900 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* Vector y Clasificación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Vector de Amenaza Principal:
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
                Nivel de Clasificación de Seguridad:
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

          {/* Matriz P x I */}
          <div className="p-4 rounded-xl bg-black/40 border border-cyan-950 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white uppercase">
                  Evaluación Táctica de Riesgo Inicial (P × I)
                </p>
                <p className="text-[11px] text-slate-400">
                  Parámetro normativo AIG No. 18-2026. Alerta crítica si P×I ≥ 20.
                </p>
              </div>
              <RiskBadge probability={probability} impact={impact} score={calculatedRisk} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-300 mb-1">
                  Probabilidad de Explotación (1 a 5): <span className="text-cyan-400 font-bold">{probability}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">
                  Impacto en la Soberanía / Servicio (1 a 5): <span className="text-rose-400 font-bold">{impact}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Medidas de Mitigación Iniciales */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Medidas de Mitigación Inmediata:
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
                placeholder="Añadir medida de contención..."
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-950">
            <Link
              href="/casos"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/60 border border-cyan-400/40 cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando Expediente...' : 'Registrar y Abrir Caso'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
