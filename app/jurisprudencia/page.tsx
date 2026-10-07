// app/jurisprudencia/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Biblioteca Institucional de Recursos Normativos y Jurisprudencia Digital

'use client';

import React, { useEffect, useState } from 'react';
import { Regulation } from '@/types/cib';
import { getAllRegulations } from '@/lib/case-service';
import {
  BookOpen,
  Search,
  Scale,
  Shield,
  FileText,
  ExternalLink,
  Layers,
  CheckCircle,
  Globe,
  Landmark,
} from 'lucide-react';

export default function JurisprudenciaPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllRegulations();
        setRegulations(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = regulations.filter((reg) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      reg.code.toLowerCase().includes(term) ||
      reg.name.toLowerCase().includes(term) ||
      reg.summary.toLowerCase().includes(term) ||
      reg.keyArticles.some(
        (a) =>
          a.articleNumber.toLowerCase().includes(term) ||
          a.description.toLowerCase().includes(term) ||
          a.forensicApplication.toLowerCase().includes(term)
      );

    const matchesJurisdiction =
      jurisdictionFilter === 'ALL' || reg.jurisdiction === jurisdictionFilter;

    return matchesSearch && matchesJurisdiction;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Asesoría Legal Tecnológica & Fiscalía de Ciberdelitos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
            BIBLIOTECA DE JURISPRUDENCIA Y MARCO REGULATORIO
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Catálogo normativo oficial que sustenta la validez probatoria de la evidencia digital, la cadena de custodia y la responsabilidad penal en la República de Panamá.
          </p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 rounded-xl bg-[#0a0f1d] border border-cyan-900/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por artículo, ley, aplicación forense, palabra clave..."
            className="w-full bg-[#050914] border border-cyan-900/80 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
          />
        </div>

        <div>
          <select
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
            aria-label="Filtrar por jurisdicción de la normativa"
            className="w-full bg-[#050914] border border-cyan-900/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden focus:border-cyan-400"
          >
            <option value="ALL">Todas las Jurisdicciones</option>
            <option value="PANAMA">República de Panamá (Nacional)</option>
            <option value="INTERNACIONAL">Estándares Internacionales</option>
          </select>
        </div>
      </div>

      {/* Listado de Normativas */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono">
          <span className="inline-block w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></span>
          <p>Cargando catálogo jurisprudencial...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#090e1a] border border-cyan-950 font-mono text-slate-400">
          <p className="font-bold text-slate-200">No se hallaron normas con los términos de búsqueda</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((reg) => (
            <div
              key={reg.id}
              className="p-6 rounded-2xl bg-[#090e1a] border border-cyan-900/40 hover:border-cyan-700/60 transition-all shadow-xl font-mono space-y-4"
            >
              {/* Encabezado de la Norma */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-950 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md bg-cyan-950 text-cyan-300 font-black text-sm border border-cyan-800">
                    {reg.code}
                  </span>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {reg.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      reg.jurisdiction === 'PANAMA'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {reg.jurisdiction === 'PANAMA' ? (
                      <Landmark className="w-3 h-3 text-blue-400" />
                    ) : (
                      <Globe className="w-3 h-3 text-emerald-400" />
                    )}
                    {reg.jurisdiction === 'PANAMA' ? 'PANAMÁ' : 'INTERNACIONAL'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Promulgación: {reg.promulgationDate}
                  </span>
                </div>
              </div>

              {/* Resumen */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {reg.summary}
              </p>

              {/* Artículos Clave y Aplicación Forense */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Artículos Esenciales y Aplicabilidad Pericial:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {reg.keyArticles.map((art, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-black/40 border border-cyan-950 space-y-1.5"
                    >
                      <div className="text-cyan-300 font-bold flex items-center justify-between">
                        <span>{art.articleNumber}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {art.description}
                      </p>
                      <div className="pt-1.5 border-t border-cyan-950/60 text-[11px] text-amber-300/90 font-mono">
                        <strong>Aplicación Pericial CIB:</strong> {art.forensicApplication}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
