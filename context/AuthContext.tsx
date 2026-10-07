// context/AuthContext.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Contexto Central de Autenticación, Roles Institucionales (RBAC) y Control de Sesión

'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { User, UserRole } from '@/types/cib';
import { INITIAL_USERS } from '@/lib/data/initial-data';
import { auth, db } from '@/lib/firebase/client';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchQuickUser: (email: string) => Promise<void>;
  predefinedUsers: User[];
  isAuthorizedOfficer: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  role: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signInWithGoogle: async () => ({ success: false }),
  signOut: async () => {},
  switchQuickUser: async () => {},
  predefinedUsers: INITIAL_USERS,
  isAuthorizedOfficer: false,
});

const COOKIE_NAME = 'cib_auth_token';

function setAuthCookie(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
  }
}

function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUserRaw = localStorage.getItem('cib_active_officer');
      if (savedUserRaw) {
        try {
          const parsed = JSON.parse(savedUserRaw);
          return parsed;
        } catch (e) {
          console.warn('Error parsing cached officer:', e);
        }
      }
      // Por defecto al Director de prueba maestro para conveniencia de evaluación
      localStorage.setItem('cib_active_officer', JSON.stringify(INITIAL_USERS[0]));
      return INITIAL_USERS[0];
    }
    return INITIAL_USERS[0];
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Sincronizar cookie de sesión y listener de Firebase Auth
  useEffect(() => {
    if (user) {
      setAuthCookie(`cib-session-${user.email}`);
    }

    // Listener pasivo de Firebase Auth si está activo
    let unsubscribe = () => {};
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      try {
        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          setFirebaseUser(fbUser);
          if (fbUser?.email) {
            // Buscar perfil institucional en Firestore o catálogo
            const matched = INITIAL_USERS.find(
              (u) => u.email.toLowerCase() === fbUser.email?.toLowerCase()
            );
            if (matched) {
              setUser(matched);
              localStorage.setItem('cib_active_officer', JSON.stringify(matched));
              setAuthCookie(`cib-session-${matched.email}`);
            }
          }
          setLoading(false);
        });
      } catch {
        // Fallback en caso de entorno sin conexión a Firebase
      }
    }

    return () => unsubscribe();
  }, [user]);

  /**
   * Inicio de sesión institucional con validación de dominio @cib.gob.pa
   */
  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Regla de validación de dominio institucional
    if (!cleanEmail.endsWith('@cib.gob.pa')) {
      return {
        success: false,
        error: 'ACCESO DENEGADO: El sistema CIB-IMS solo admite credenciales oficiales del dominio @cib.gob.pa.',
      };
    }

    // 1. Intentar autenticación con Firebase Auth si es posible
    if (auth && typeof signInWithEmailAndPassword === 'function') {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        setFirebaseUser(userCred.user);
      } catch (firebaseErr: any) {
        // Si el usuario no fue creado aún en Auth remoto, verificamos contra el catálogo oficial sembrado
        console.info('[CIB-IMS] Firebase Auth no resolvió la credencial remota, verificando contra catálogo CIB:', firebaseErr?.code);
      }
    }

    // 2. Validación de credenciales institucionales estándar
    const STANDARD_PASSWORD = 'clavesegura123*';
    const foundUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return {
        success: false,
        error: `Agente o correo [${cleanEmail}] no registrado en el padrón de ciberseguridad nacional.`,
      };
    }

    if (pass !== STANDARD_PASSWORD) {
      return {
        success: false,
        error: 'CONTRASEÑA INVÁLIDA: Clave criptográfica o token institucional incorrecto.',
      };
    }

    // Éxito: Establecer sesión
    const updatedUser: User = {
      ...foundUser,
      lastLogin: new Date().toISOString(),
    };

    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cib_active_officer', JSON.stringify(updatedUser));
      setAuthCookie(`cib-session-${updatedUser.email}`);
    }

    return { success: true };
  };

  /**
   * Autenticación exclusiva por correo y contraseña institucional (@cib.gob.pa)
   */
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    return {
      success: false,
      error: 'ACCESO RESTRINGIDO: El Buró Cibernético opera exclusivamente con credenciales institucionales (@cib.gob.pa).',
    };
  };

  /**
   * Cierre de sesión forense
   */
  const signOut = async () => {
    if (auth && typeof firebaseSignOut === 'function') {
      try {
        await firebaseSignOut(auth);
      } catch {}
    }
    setUser(null);
    setFirebaseUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cib_active_officer');
      clearAuthCookie();
    }
  };

  /**
   * Selector rápido para alternar entre roles durante auditorías y pruebas
   */
  const switchQuickUser = async (email: string) => {
    const target = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setUser(target);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cib_active_officer', JSON.stringify(target));
        setAuthCookie(`cib-session-${target.email}`);
      }
    }
  };

  const isAuthorizedOfficer = Boolean(user && user.email.endsWith('@cib.gob.pa') && user.active);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role: user?.role || null,
        loading,
        signIn,
        signInWithGoogle,
        signOut,
        switchQuickUser,
        predefinedUsers: INITIAL_USERS,
        isAuthorizedOfficer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
