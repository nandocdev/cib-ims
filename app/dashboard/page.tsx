// app/dashboard/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Dashboard Ejecutivo y Panel Táctico de Control Forense

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Case } from '@/types/cib';
import { getAllCases } from '@/lib/case-service';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge, ClassificationBadge, RiskBadge } from '@/components/StatusBadge';
import {
  ShieldAlert,
  ShieldCheck,
  FolderOpen,
  Lock,
  Eye,
  Edit3,
  PlusCircle,
  FileText,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Database,
  Terminal,
  Activity,
  Layers,
  BarChart3,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllCases();
        setCases(data);
      } catch (e) {
        console.error('Error loading cases:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Métricas y KPIs en vivo
  const totalCases = cases.length;
  const openCases = cases.filter((c) => c.status === 'ABIERTO').length;
  const auditCases = cases.filter((c) => c.status === 'EN_AUDITORIA').length;
  const closedCases = cases.filter((c) => c.status === 'CERRADO').length;
  const criticalCases = cases.filter((c) => c.riskScore >= 20).length;

  // Desglose por Clasificación
  const reservadoCount = cases.filter((c) => c.classification === 'RESERVADO').length;
  const confidencialCount = cases.filter((c) => c.classification === 'CONFIDENCIAL').length;
  const secretoCount = cases.filter((c) => c.classification === 'SECRETO DE ESTADO').length;

  // Filtrado de expedientes
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.operationCodename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetEntity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner de Bienvenida Táctica y Estado Operativo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-linear-to-r from-[#0c1322] via-[#09101c] to-[#070b14] border border-cyan-900/60 shadow-xl shadow-black/60 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
              SALA DE SITUACIÓN CIB
            </span>
            <span className="text-xs font-mono text-slate-400">
              Panamá, {new Date().toLocaleDateString('es-PA', { dateStyle: 'long' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            PANEL EJECUTIVO DE CIBERINCIDENTES
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-300 mt-1">
            Oficial en Comando:{' '}
            <strong className="text-cyan-400">{user?.displayName || 'Rafael Mendoza'}</strong> (Placa:{' '}
            <span className="text-emerald-400">{user?.badgeNumber || 'CIB-001'}</span> • Rol:{' '}
            <span className="text-yellow-400">{user?.role?.replace(/_/g, ' ') || 'COMISIONADO DIRECTOR'}</span>)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/casos/nuevo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/60 border border-cyan-400/40 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Nuevo Incidente</span>
          </Link>
          <Link
            href="/jurisprudencia"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-mono text-xs font-semibold transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Marco Legal</span>
          </Link>
        </div>
      </div>

      {/* TARJETAS DE RESUMEN MÉTRICO (Total, Abiertos, Cerrados, Críticos PxI >= 20) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Casos */}
        <div className="p-5 rounded-xl bg-[#0a0f1d] border border-cyan-900/40 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Total Expedientes
            </p>
            <p className="text-3xl font-black font-mono text-white mt-1">{totalCases}</p>
            <p className="text-[11px] font-mono text-slate-400 mt-1">Registrados en Búnker CIB</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Casos Abiertos */}
        <div className="p-5 rounded-xl bg-[#0a0f1d] border border-emerald-900/50 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Casos Abiertos (Activos)
            </p>
            <p className="text-3xl font-black font-mono text-emerald-300 mt-1">{openCases}</p>
            <p className="text-[11px] font-mono text-emerald-500/80 mt-1">Edición y peritaje habilitados</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Casos Cerrados / Sellados */}
        <div className="p-5 rounded-xl bg-[#0a0f1d] border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Casos Cerrados (Sellados)
            </p>
            <p className="text-3xl font-black font-mono text-slate-300 mt-1">{closedCases}</p>
            <p className="text-[11px] font-mono text-rose-400/80 mt-1">Cadena de custodia inmutable</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
            <Lock className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        {/* Incidentes Críticos (P x I >= 20) */}
        <div className="p-5 rounded-xl bg-[#140b12] border border-rose-900/60 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Incidentes Críticos</span>
              <span className="text-[10px] px-1 py-0.2 bg-rose-950 text-rose-300 rounded border border-rose-800">
                P×I ≥ 20
              </span>
            </p>
            <p className="text-3xl font-black font-mono text-rose-300 mt-1">{criticalCases}</p>
            <p className="text-[11px] font-mono text-rose-400/90 mt-1">Alerta Roja / AIG Res. 18</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-600/60 flex items-center justify-center text-rose-400 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* DESGLOSE POR NIVEL DE CLASIFICACIÓN DE SEGURIDAD NACIONAL */}
      <div className="p-6 rounded-2xl bg-[#090e1a] border border-cyan-900/40 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Distribución por Clasificación de Seguridad Nacional
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Estándar Ley 51 / Seguridad Pública de Panamá
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* RESERVADO */}
          <div className="p-4 rounded-xl bg-[#060b17] border border-blue-900/40 flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                RESERVADO
              </span>
              <p className="text-2xl font-black font-mono text-blue-200 mt-2">{reservadoCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Uso interno CIB y Fiscalías</p>
            </div>
            <div className="text-xs font-mono text-blue-400 font-bold bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-800/50">
              {totalCases > 0 ? Math.round((reservadoCount / totalCases) * 100) : 0}%
            </div>
          </div>

          {/* CONFIDENCIAL */}
          <div className="p-4 rounded-xl bg-[#0c0817] border border-purple-900/40 flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                CONFIDENCIAL
              </span>
              <p className="text-2xl font-black font-mono text-purple-200 mt-2">{confidencialCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Operaciones periciales activas</p>
            </div>
            <div className="text-xs font-mono text-purple-400 font-bold bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-800/50">
              {totalCases > 0 ? Math.round((confidencialCount / totalCases) * 100) : 0}%
            </div>
          </div>

          {/* SECRETO DE ESTADO */}
          <div className="p-4 rounded-xl bg-[#17060b] border border-red-900/50 flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                SECRETO DE ESTADO
              </span>
              <p className="text-2xl font-black font-mono text-red-200 mt-2">{secretoCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Infraestructura crítica / Presidencia</p>
            </div>
            <div className="text-xs font-mono text-red-400 font-bold bg-red-950/60 px-2.5 py-1 rounded-md border border-red-800/50">
              {totalCases > 0 ? Math.round((secretoCount / totalCases) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* TABLA INTERACTIVA DE EXPEDIENTES FORENSES */}
      <div className="bg-[#090e1a] border border-cyan-900/40 rounded-2xl shadow-xl overflow-hidden">
        {/* Barra de Filtros y Búsqueda */}
        <div className="p-4 sm:p-5 border-b border-cyan-950 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#070b14]">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Terminal className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Repositorio de Expedientes Tácticos
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
              {filteredCases.length} Casos
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar código, título, entidad..."
                className="w-full bg-[#040812] border border-cyan-900/80 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
              />
            </div>

            {/* Filtro de Estado */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filtrar por estado del caso"
                className="bg-[#040812] border border-cyan-900/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-hidden focus:border-cyan-400"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="ABIERTO">Solo Abiertos (Activos)</option>
                <option value="EN_AUDITORIA">Solo En Auditoría</option>
                <option value="CERRADO">Solo Cerrados (Sellados)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#060a14] text-slate-400 border-b border-cyan-950 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Código / Operación</th>
                <th className="py-3 px-4">Clasificación</th>
                <th className="py-3 px-4">Entidad Víctima</th>
                <th className="py-3 px-4">Vector de Ataque</th>
                <th className="py-3 px-4">Evaluación P×I</th>
                <th className="py-3 px-4">Estado / Custodia</th>
                <th className="py-3 px-4 text-right">Acciones Tácticas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <span className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2"></span>
                    <p>Cargando expedientes del Búnker CIB...</p>
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No se encontraron expedientes con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCases.map((caso) => {
                  const isOpen = caso.status === 'ABIERTO';
                  return (
                    <tr
                      key={caso.codigo}
                      className="hover:bg-cyan-950/20 transition-colors group"
                    >
                      {/* Código y Operación */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {caso.codigo}
                        </div>
                        <div className="text-[11px] text-cyan-400/90 font-medium">
                          {caso.operationCodename}
                        </div>
                      </td>

                      {/* Clasificación */}
                      <td className="py-3.5 px-4">
                        <ClassificationBadge classification={caso.classification} />
                      </td>

                      {/* Entidad Afectada */}
                      <td className="py-3.5 px-4 max-w-xs truncate" title={caso.targetEntity}>
                        <div className="text-slate-200 truncate">{caso.targetEntity}</div>
                        <div className="text-[10px] text-slate-400">
                          {caso.leadInvestigatorName} ({caso.leadInvestigatorBadge})
                        </div>
                      </td>

                      {/* Vector */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-black/40 border border-slate-800 text-[10px] text-slate-300">
                          {caso.vector}
                        </span>
                      </td>

                      {/* Evaluación PxI */}
                      <td className="py-3.5 px-4">
                        <RiskBadge
                          probability={caso.probability}
                          impact={caso.impact}
                          score={caso.riskScore}
                        />
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={caso.status} />
                      </td>

                      {/* Acciones por Fila con Lógica Estricta */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Botón Ver Expediente (Accesible para TODOS los estados) */}
                          <Link
                            href={`/casos/${caso.codigo}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold transition-colors cursor-pointer"
                            title="Ver Expediente Completo (Dossier Forense)"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver</span>
                          </Link>

                          {/* Botón Resolver / Editar Expediente:
                              ÚNICAMENTE ACTIVO/HABILITADO cuando status === 'ABIERTO'.
                              Si status !== 'ABIERTO', botón deshabilitado con candado y tooltip explicativo */}
                          {isOpen ? (
                            <Link
                              href={`/casos/${caso.codigo}/editar`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 border border-emerald-400 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                              title="Resolver e intervenir en este expediente abierto (Taller estudiantil)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Resolver</span>
                            </Link>
                          ) : (
                            <div className="relative group/tooltip inline-block">
                              <button
                                disabled
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 text-xs cursor-not-allowed opacity-60 font-medium"
                                aria-disabled="true"
                              >
                                <Lock className="w-3.5 h-3.5 text-rose-400" />
                                <span>Sellado</span>
                              </button>

                              {/* Tooltip explicativo forense institucional */}
                              <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/tooltip:block w-64 p-2 bg-black/95 text-rose-300 border border-rose-500/50 rounded-lg text-[10px] leading-snug shadow-xl z-50 pointer-events-none text-left">
                                <span className="font-bold block text-rose-400">
                                  CADENA DE CUSTODIA SELLADA
                                </span>
                                Expediente cerrado / Cadena de custodia sellada: Edición restringida bajo Ley 51 de 2008.
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
