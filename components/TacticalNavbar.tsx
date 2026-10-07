// components/TacticalNavbar.tsx
// Buró Cibernético de Investigación (CIB / CSI Cyber) - República de Panamá
// Barra de navegación táctica con telemetría de usuario y conmutador rápido de roles

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  FileText,
  PlusCircle,
  BookOpen,
  HelpCircle,
  LogOut,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { resetInstitutionalData } from '@/lib/case-service';

export function TacticalNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, signOut, switchQuickUser, predefinedUsers } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  // No renderizar en la página de login
  if (pathname === '/login') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleSeedCloud = async () => {
    setIsSeeding(true);
    setSeedNotice(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSeedNotice('Cloud Firestore sembrado exitosamente (10 usuarios, 11 marcos legales, 14 expedientes oficiales).');
        setTimeout(() => setSeedNotice(null), 4000);
      } else {
        setSeedNotice(`Aviso: ${data.error || 'No se pudo sincronizar'}`);
        setTimeout(() => setSeedNotice(null), 4000);
      }
    } catch {
      setSeedNotice('Comando enviado a la nube.');
      setTimeout(() => setSeedNotice(null), 3000);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleReset = () => {
    if (confirm('¿Restablecer repositorio al catálogo oficial de 14 expedientes del CIB (3 abiertos para taller + 11 precedentes)?')) {
      setIsResetting(true);
      resetInstitutionalData();
      setTimeout(() => {
        setIsResetting(false);
        window.location.reload();
      }, 400);
    }
  };

  const navItems = [
    { label: 'DASHBOARD', href: '/dashboard', icon: Activity },
    { label: 'EXPEDIENTES', href: '/casos', icon: FileText },
    { label: 'NUEVO INCIDENTE', href: '/casos/nuevo', icon: PlusCircle },
    { label: 'JURISPRUDENCIA', href: '/jurisprudencia', icon: BookOpen },
    { label: 'SIMULADOR FORENSE', href: '/simulador', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-cyan-900/40 shadow-lg shadow-black/60">
      {/* Barra superior de telemetría institucional panameña */}
      <div className="bg-[#05080f] px-4 py-1 text-[11px] font-mono text-cyan-500/80 border-b border-cyan-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-cyan-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            REPÚBLICA DE PANAMÁ • BURÓ CIBERNÉTICO DE INVESTIGACIÓN (CIB / CSI CYBER)
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            SISTEMA INTEGRAL DE GESTIÓN DE INCIDENTES (CIB-IMS v4.2)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">CSIRT-PANAMÁ PROTOCOL: ACTIVO</span>
          <button
            onClick={handleSeedCloud}
            disabled={isSeeding}
            title="Poblar y sincronizar colecciones en Cloud Firestore"
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 hover:border-cyan-500"
          >
            <Terminal className={`w-3 h-3 ${isSeeding ? 'animate-pulse text-yellow-400' : ''}`} />
            <span>{isSeeding ? 'Sembrando...' : 'Sembrar Firestore'}</span>
          </button>
          <button
            onClick={handleReset}
            disabled={isResetting}
            title="Restablecer datos originales oficiales"
            className="flex items-center gap-1 text-[10px] text-amber-400/80 hover:text-amber-300 transition-colors cursor-pointer px-1.5 py-0.5 rounded border border-amber-500/20 hover:border-amber-500/50"
          >
            <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {seedNotice && (
        <div className="bg-emerald-950 text-emerald-200 border-b border-emerald-500 px-4 py-1.5 text-xs font-mono text-center flex items-center justify-center gap-2 animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{seedNotice}</span>
        </div>
      )}

      {/* Navegación Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Identidad CIB */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-cyan-950 to-blue-950 border border-cyan-500/50 shadow-inner group-hover:border-cyan-400 transition-all">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-red-600 border border-black flex items-center justify-center text-[7px] font-bold text-white">
                PA
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-mono tracking-wider text-white">
                  CIB<span className="text-cyan-400">-IMS</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  FORENSIC
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 tracking-tight">
                REP. DE PANAMÁ • CADENA DE CUSTODIA
              </p>
            </div>
          </Link>

          {/* Enlaces de Navegación */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-xs shadow-cyan-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Menú de Agente y Cambio Rápido de Roles */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-900/50 hover:border-cyan-500/60 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-md bg-linear-to-b from-cyan-900 to-slate-950 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-300 text-xs shadow-xs">
                  {user?.badgeNumber ? user.badgeNumber.substring(0, 3) : 'CIB'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight group-hover:text-cyan-300">
                    {user?.displayName || 'Agente CIB'}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400/90">
                    {user?.badgeNumber || 'SIN PLACA'} • {user?.role?.replace(/_/g, ' ') || 'OFICIAL'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-transform" />
              </button>

              {/* Dropdown de cambio de rol institucional (10 usuarios oficiales) */}
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0c1220] border border-cyan-800/60 shadow-2xl shadow-black p-3 z-50 text-xs font-mono"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-2 py-1.5 border-b border-cyan-950/80 mb-2">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      Oficial Activo en Sesión
                    </p>
                    <p className="text-white font-semibold">{user?.displayName}</p>
                    <p className="text-[11px] text-slate-400">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Rol: {user?.role}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-bold uppercase px-2 py-1">
                    Cambiar Agente de Prueba (10 Roles CIB):
                  </p>
                  <div className="max-h-56 overflow-y-auto space-y-1 my-1 pr-1 scrollbar-thin">
                    {predefinedUsers.map((u) => {
                      const isCurrent = u.email === user?.email;
                      return (
                        <button
                          key={u.email}
                          onClick={() => {
                            switchQuickUser(u.email);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-[11px] transition-colors ${
                            isCurrent
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="leading-tight">{u.displayName}</div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                          <span className="text-[9px] px-1 py-0.5 rounded bg-black/40 text-cyan-400 border border-cyan-900">
                            {u.badgeNumber}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-cyan-950/80 pt-2 mt-2 flex justify-between items-center">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 hover:bg-rose-900 text-xs w-full justify-center transition-colors font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Cerrar Sesión Forense
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subbarra móvil de navegación */}
      <div className="lg:hidden flex items-center justify-around border-t border-cyan-950 px-2 py-1.5 bg-[#070b14]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 p-1 rounded text-[10px] font-mono ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
