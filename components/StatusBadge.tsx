// components/StatusBadge.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá

import React from 'react';
import { CaseClassification, CaseStatus } from '@/types/cib';
import { Lock, Unlock, FileCheck, ShieldAlert, Shield, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: CaseStatus;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  switch (status) {
    case 'ABIERTO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-xs shadow-emerald-900/30">
          {showIcon && <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>}
          <span>ABIERTO (ACTIVO)</span>
        </span>
      );
    case 'EN_AUDITORIA':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-xs shadow-amber-900/30">
          {showIcon && <FileCheck className="w-3.5 h-3.5 text-amber-400" />}
          <span>EN AUDITORÍA</span>
        </span>
      );
    case 'CERRADO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-xs shadow-rose-900/30">
          {showIcon && <Lock className="w-3.5 h-3.5 text-rose-400" />}
          <span>CERRADO (SELLADO)</span>
        </span>
      );
    default:
      return null;
  }
}

interface ClassificationBadgeProps {
  classification: CaseClassification;
}

export function ClassificationBadge({ classification }: ClassificationBadgeProps) {
  switch (classification) {
    case 'RESERVADO':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider font-semibold bg-blue-950/80 text-blue-300 border border-blue-500/30">
          <Shield className="w-3 h-3 text-blue-400" />
          RESERVADO
        </span>
      );
    case 'CONFIDENCIAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono tracking-wider font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/30">
          <ShieldCheck className="w-3 h-3 text-purple-400" />
          CONFIDENCIAL
        </span>
      );
    case 'SECRETO DE ESTADO':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider font-bold bg-red-950 text-red-200 border border-red-500/60 shadow-xs shadow-red-900/50">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          SECRETO DE ESTADO
        </span>
      );
    default:
      return null;
  }
}

interface RiskBadgeProps {
  probability: number;
  impact: number;
  score: number;
}

export function RiskBadge({ probability, impact, score }: RiskBadgeProps) {
  const isCritical = score >= 20;
  const isHigh = score >= 15 && score < 20;
  const isMedium = score >= 10 && score < 15;

  let colorClasses = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';
  let label = 'BAJO';

  if (isCritical) {
    colorClasses = 'bg-rose-950 text-rose-200 border-rose-500 shadow-xs shadow-rose-900/40 animate-pulse';
    label = 'CRÍTICO';
  } else if (isHigh) {
    colorClasses = 'bg-amber-950/90 text-amber-200 border-amber-500/60 shadow-xs shadow-amber-900/30';
    label = 'ALTO';
  } else if (isMedium) {
    colorClasses = 'bg-yellow-950/70 text-yellow-300 border-yellow-500/40';
    label = 'MEDIO';
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${colorClasses}`}>
      <span className="tracking-wider">{label}</span>
      <span className="text-[10px] opacity-80 px-1 py-0.5 bg-black/40 rounded border border-white/10">
        P{probability}×I{impact} = {score}/25
      </span>
    </div>
  );
}
