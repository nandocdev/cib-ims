// app/login/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Portal de Autenticación Táctica y Acceso Restringido Forense

'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  AlertTriangle,
  KeyRound,
  Terminal,
  Fingerprint,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const { signIn, predefinedUsers, isDemoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push(redirectTarget);
      } else {
        setError(result.error || 'Fallo de autenticación en nodo perimetral CIB.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error inesperado al conectar con el servidor de autenticación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDemoProfile = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword('CibPass2026!*');
    setError(null);
  };

  return (
    <div className="w-full max-w-xl relative z-10">
      {/* Cabecera Institucional Oficial */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-b from-cyan-950 to-slate-950 border border-cyan-500/50 shadow-xl shadow-cyan-950/60 mb-4 relative">
          <Shield className="w-10 h-10 text-cyan-400" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-600 border-2 border-slate-950 flex items-center justify-center text-[9px] font-black text-white shadow-md">
            PA
          </div>
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[11px] font-mono text-cyan-300 font-semibold tracking-wider mb-2">
          REPÚBLICA DE PANAMÁ • MINISTERIO DE SEGURIDAD PÚBLICA
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
          BURÓ CIBERNÉTICO DE INVESTIGACIÓN
        </h1>
        <p className="text-sm font-mono text-cyan-400/90 mt-1">
          CIB-IMS (Cyber Incident Management System)
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Acceso restringido a oficiales autorizados. Conexión monitoreada bajo la Ley 51 de 2008 y Resolución AIG 18-2026.
        </p>
      </div>

      {/* Tarjeta de Inicio de Sesión */}
      <div className="bg-[#0b101d]/90 backdrop-blur-xl border border-cyan-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        <div className="flex items-center justify-between border-b border-cyan-950 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Terminal de Autenticación Táctica
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            FIREWALL ACTIVO
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/90 border border-rose-500/80 text-rose-200 text-xs font-mono flex items-start gap-3 shadow-lg shadow-rose-950/40">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-300">VIOLACIÓN DE ACCESO / FALLO DE AUTENTICACIÓN</p>
              <p className="mt-1 opacity-90">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
              Correo Institucional (@cib.gob.pa):
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@cib.gob.pa"
                required
                className="w-full bg-[#060a14] border border-cyan-900/80 rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
              Clave Criptográfica / Contraseña Institucional:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                required
                className="w-full bg-[#060a14] border border-cyan-900/80 rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/60 border border-cyan-400/40 hover:border-cyan-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Verificando Credencial Forense...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>Ingresar al Sistema Táctico</span>
              </>
            )}
          </button>
        </form>

        {/* Perfiles de Simulación y Evaluación (Solo visible en MODO DEMO / DESARROLLO) */}
        {isDemoMode && (
          <div className="mt-6 border-t border-cyan-950 pt-4">
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 mb-3 text-[11px] font-mono text-amber-300">
              <span className="font-bold">⚠️ ENTORNO DE SIMULACIÓN / EVALUACIÓN ACADÉMICA</span>
              <p className="text-[10px] text-slate-300 mt-0.5">
                Seleccione un perfil para pre-cargar credenciales de prueba del catálogo institucional.
              </p>
            </div>

            <div className="text-[11px] font-mono text-slate-400 font-semibold mb-2 flex items-center justify-between">
              <span>Perfiles de Prueba por Rol Institucional:</span>
              <span className="text-[10px] text-cyan-400">Autocompletar</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
              {predefinedUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleSelectDemoProfile(u.email)}
                  className={`p-2 rounded-lg text-left text-[10px] font-mono border transition-all cursor-pointer ${
                    email === u.email
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                      : 'bg-black/30 border-slate-800 text-slate-400 hover:border-cyan-800 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold truncate text-slate-200">{u.displayName.split(' ')[0]} {u.displayName.split(' ')[1]}</div>
                  <div className="text-[9px] text-cyan-400 truncate">{u.role}</div>
                  <div className="text-[9px] text-slate-500 truncate">{u.email}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden bg-radial from-[#0d1527] via-[#070b14] to-[#04070d]">
      {/* Elementos visuales tácticos de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <Suspense fallback={
        <div className="text-center font-mono text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Cargando terminal de autenticación CIB...</p>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
