// context/AuthContext.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Contexto Central de Autenticación Basado en Firebase Auth y RBAC Institucional

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types/cib';
import { INITIAL_USERS } from '@/lib/data/initial-data';
import { auth, db } from '@/lib/firebase/client';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ENV } from '@/lib/config/environment';
import { Permission } from '@/lib/domain/auth/permissions';
import { canActor } from '@/lib/domain/auth/role-permissions';
import { logger } from '@/lib/observability/logger';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchQuickUser: (email: string) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  predefinedUsers: User[];
  isAuthorizedOfficer: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  role: null,
  loading: true,
  isDemoMode: ENV.isDemo,
  signIn: async () => ({ success: false }),
  signInWithGoogle: async () => ({ success: false }),
  signOut: async () => {},
  switchQuickUser: async () => {},
  hasPermission: () => false,
  predefinedUsers: INITIAL_USERS,
  isAuthorizedOfficer: false,
});

const COOKIE_NAME = 'cib_auth_token';

function setSessionTokenCookie(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
  }
}

function clearSessionTokenCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listener de Firebase Authentication
  useEffect(() => {
    let unsubscribe = () => {};

    if (auth && typeof auth.onAuthStateChanged === 'function') {
      try {
        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          setFirebaseUser(fbUser);

          if (fbUser) {
            try {
              // Obtener token JWT real para la cookie de sesión del servidor
              const idToken = await fbUser.getIdToken();
              setSessionTokenCookie(idToken);

              // 1. Intentar cargar perfil desde Firestore
              let profile: User | null = null;
              if (db && typeof db.app !== 'undefined') {
                try {
                  const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
                  if (userDoc.exists()) {
                    profile = userDoc.data() as User;
                  }
                } catch (dbErr) {
                  logger.warn('Error al consultar perfil de usuario en Firestore', { uid: fbUser.uid }, dbErr);
                }
              }

              // 2. Si no existe en Firestore, asociar con catálogo institucional inicial o crear perfil
              if (!profile) {
                const matched = INITIAL_USERS.find(
                  (u) => u.email.toLowerCase() === fbUser.email?.toLowerCase()
                );
                if (matched) {
                  profile = {
                    ...matched,
                    uid: fbUser.uid,
                    lastLogin: new Date().toISOString(),
                  };
                  // Persistir perfil en Firestore para futuras consultas
                  if (db && typeof db.app !== 'undefined') {
                    try {
                      await setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true });
                    } catch {}
                  }
                }
              }

              setUser(profile);
            } catch (tokenErr) {
              logger.error('Error al resolver token de Firebase Auth', undefined, tokenErr);
            }
          } else {
            // No autenticado
            setUser(null);
            clearSessionTokenCookie();
          }

          setLoading(false);
        });
      } catch (authInitErr) {
        logger.error('Error al inicializar listener de Firebase Auth', undefined, authInitErr);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  /**
   * Inicio de sesión institucional real vía Firebase Authentication
   */
  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Validación obligatoria de dominio institucional
    if (!cleanEmail.endsWith('@cib.gob.pa')) {
      return {
        success: false,
        error: 'ACCESO DENEGADO: El sistema CIB-IMS solo admite credenciales oficiales del dominio @cib.gob.pa.',
      };
    }

    if (!pass || pass.length < 6) {
      return {
        success: false,
        error: 'CONTRASEÑA INVÁLIDA: La contraseña debe tener al menos 6 caracteres.',
      };
    }

    // 1. Autenticación real con Firebase Authentication
    if (auth && typeof signInWithEmailAndPassword === 'function') {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const idToken = await userCred.user.getIdToken();
        setSessionTokenCookie(idToken);
        setFirebaseUser(userCred.user);
        return { success: true };
      } catch (firebaseErr: any) {
        logger.warn('Fallo de autenticación con Firebase Auth', { email: cleanEmail, code: firebaseErr?.code });

        // En modo DEMO o DEVELOPMENT: si el usuario existe en catálogo pero aún no en Firebase Auth, registrarlo
        if (ENV.isDemo || ENV.isDevelopment) {
          if (firebaseErr?.code === 'auth/user-not-found' || firebaseErr?.code === 'auth/invalid-credential') {
            const catalogUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
            if (catalogUser && typeof createUserWithEmailAndPassword === 'function') {
              try {
                const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
                const idToken = await newCred.user.getIdToken();
                setSessionTokenCookie(idToken);
                setFirebaseUser(newCred.user);
                return { success: true };
              } catch (createErr) {
                logger.warn('Error al auto-registrar usuario en modo desarrollo', undefined, createErr);
              }
            }
          }
        }

        return {
          success: false,
          error:
            firebaseErr?.code === 'auth/wrong-password' || firebaseErr?.code === 'auth/invalid-credential'
              ? 'CONTRASEÑA INCORRECTA: Credenciales no válidas ante el servicio de autenticación.'
              : `ERROR DE AUTENTICACIÓN: ${firebaseErr?.message || 'No fue posible validar credenciales.'}`,
        };
      }
    }

    return {
      success: false,
      error: 'SERVICIO NO DISPONIBLE: El proveedor de autenticación no se encuentra inicializado.',
    };
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    return {
      success: false,
      error: 'ACCESO RESTRINGIDO: El Buró Cibernético opera exclusivamente con credenciales institucionales (@cib.gob.pa).',
    };
  };

  /**
   * Cierre de sesión formal
   */
  const signOut = async () => {
    if (auth && typeof firebaseSignOut === 'function') {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        logger.warn('Error durante cierre de sesión en Firebase Auth', undefined, err);
      }
    }
    setUser(null);
    setFirebaseUser(null);
    clearSessionTokenCookie();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cib_active_officer');
    }
  };

  /**
   * Selector rápido exclusivo para modo DEMO / DEVELOPMENT
   * Prohibido estrictamente en producción institucional
   */
  const switchQuickUser = async (email: string) => {
    if (ENV.isProduction) {
      throw new Error('ACCESO DENEGADO: El cambio rápido de usuario está deshabilitado en entorno de PRODUCCIÓN.');
    }

    const target = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setUser(target);
      setSessionTokenCookie(`cib-demo-token-${target.email}`);
      logger.info(`[DEMO_MODE] Sesión simulada activa para: ${target.email} (${target.role})`);
    }
  };

  const hasPermissionCheck = (permission: Permission): boolean => {
    return canActor(user?.role, permission);
  };

  const isAuthorizedOfficer = Boolean(user && user.email.endsWith('@cib.gob.pa') && user.active);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role: user?.role || null,
        loading,
        isDemoMode: ENV.isDemo || ENV.isDevelopment,
        signIn,
        signInWithGoogle,
        signOut,
        switchQuickUser,
        hasPermission: hasPermissionCheck,
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
