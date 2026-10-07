// app/casos/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Repositorio General de Expedientes Forenses y Búsqueda Avanzada

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Case, AttackVector } from '@/types/cib';
import { getAllCases } from '@/lib/case-service';
import { StatusBadge, ClassificationBadge, RiskBadge } from '@/components/StatusBadge';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit3,
  Lock,
  Layers,
  Shield,
  Activity,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export default function CasosPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vectorFilter, setVectorFilter] = useState('ALL');
  const [classificationFilter, setClassificationFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllCases();
        setCases(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const attackVectors: AttackVector[] = [
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
  ];

  const filtered = cases.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.codigo.toLowerCase().includes(term) ||
      c.title.toLowerCase().includes(term) ||
      c.operationCodename.toLowerCase().includes(term) ||
      c.targetEntity.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesVector = vectorFilter === 'ALL' || c.vector === vectorFilter;
    const matchesClassification =
      classificationFilter === 'ALL' || c.classification === classificationFilter;

    return matchesSearch && matchesStatus && matchesVector && matchesClassification;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
            <span>División de Registro Forense Digital</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            REPOSITORIO DE EXPEDIENTES FORENSES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Archivo oficial del Buró Cibernético de Investigación. Todos los registros cumplen con la Ley 51 de 2008 de inmutabilidad procesal.
          </p>
        </div>

        <Link
          href="/casos/nuevo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/60 border border-cyan-400/40 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Alta de Expediente</span>
        </Link>
      </div>

      {/* Controles de Filtrado Avanzado */}
      <div className="p-4 rounded-xl bg-[#0a0f1d] border border-cyan-900/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        {/* Búsqueda por texto */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, víctima, título..."
            className="w-full bg-[#050914] border border-cyan-900/80 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
          />
        </div>

        {/* Filtro de Estado */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtrar por estado del expediente"
            className="w-full bg-[#050914] border border-cyan-900/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-cyan-400"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="ABIERTO">ABIERTO (Activo)</option>
            <option value="EN_AUDITORIA">EN AUDITORÍA</option>
            <option value="CERRADO">CERRADO (Sellado)</option>
          </select>
        </div>

        {/* Filtro de Vector de Ataque */}
        <div>
          <select
            value={vectorFilter}
            onChange={(e) => setVectorFilter(e.target.value)}
            aria-label="Filtrar por vector de ataque"
            className="w-full bg-[#050914] border border-cyan-900/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-cyan-400"
          >
            <option value="ALL">Todos los Vectores</option>
            {attackVectors.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Clasificación */}
        <div>
          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            aria-label="Filtrar por clasificación de seguridad"
            className="w-full bg-[#050914] border border-cyan-900/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-cyan-400"
          >
            <option value="ALL">Todas las Clasificaciones</option>
            <option value="RESERVADO">RESERVADO</option>
            <option value="CONFIDENCIAL">CONFIDENCIAL</option>
            <option value="SECRETO DE ESTADO">SECRETO DE ESTADO</option>
          </select>
        </div>
      </div>

      {/* Listado de Tarjetas / Expedientes */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono">
          <span className="inline-block w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></span>
          <p>Consultando repositorio seguro CIB...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#090e1a] border border-cyan-950 font-mono text-slate-400">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-200">No se encontraron expedientes coincidentes</p>
          <p className="text-xs text-slate-500 mt-1">Ajuste los filtros o registre un nuevo incidente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((caso) => {
            const isOpen = caso.status === 'ABIERTO';
            return (
              <div
                key={caso.codigo}
                className="rounded-2xl bg-[#0a0f1d] border border-cyan-900/40 hover:border-cyan-500/60 transition-all p-5 shadow-lg flex flex-col justify-between group"
              >
                <div>
                  {/* Cabecera de la Tarjeta */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                        {caso.codigo}
                      </span>
                      <h3 className="text-sm font-mono font-bold text-white mt-0.5 leading-snug">
                        {caso.operationCodename}
                      </h3>
                    </div>
                    <ClassificationBadge classification={caso.classification} />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                    {caso.summary}
                  </p>

                  {caso.studentMission && isOpen && (
                    <div className="mb-3 p-2 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-[11px] font-mono text-emerald-300">
                      <span className="font-bold">🎯 Misión de Resolución: </span>
                      <span className="text-slate-300">{caso.studentMission}</span>
                    </div>
                  )}

                  {/* Ficha técnica rápida */}
                  <div className="space-y-2 py-3 border-y border-cyan-950/80 text-[11px] font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Víctima / Entidad:</span>
                      <span className="text-slate-200 font-semibold truncate max-w-[180px]">
                        {caso.targetEntity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vector de Ataque:</span>
                      <span className="text-cyan-300">{caso.vector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investigador Líder:</span>
                      <span className="text-slate-300 truncate max-w-[180px]">
                        {caso.leadInvestigatorName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span>Severidad P×I:</span>
                      <RiskBadge
                        probability={caso.probability}
                        impact={caso.impact}
                        score={caso.riskScore}
                      />
                    </div>
                  </div>
                </div>

                {/* Pie con Estado y Acciones Condicionadas */}
                <div className="pt-4 mt-2 flex items-center justify-between border-t border-cyan-950/60">
                  <StatusBadge status={caso.status} />

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/casos/${caso.codigo}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold transition-colors"
                      title="Ver Dossier Completo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver</span>
                    </Link>

                    {/* Botón de Resolución: SOLO HABILITADO si status === 'ABIERTO' */}
                    {isOpen ? (
                      <Link
                        href={`/casos/${caso.codigo}/editar`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 border border-emerald-400 text-xs font-mono font-bold transition-colors shadow-sm"
                        title="Resolver e intervenir en este expediente abierto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Resolver</span>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 text-xs font-mono cursor-not-allowed opacity-60"
                        title="Expediente cerrado / Cadena de custodia sellada: Edición restringida"
                      >
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sellado</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
