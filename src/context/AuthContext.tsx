import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  sendEmailAccessLink,
  checkIsEmailSignInLink,
  completeEmailSignInLink,
  syncUserProfile,
  subscribeUserAccesses,
  getUserAccesses,
  AppUserProfile,
} from '../lib/firebase';
import { FirestoreUserAccess, ValidModuleId } from '../types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: AppUserProfile | null;
  userAccesses: FirestoreUserAccess[];
  loading: boolean;
  loadingAccesses: boolean;
  error: string | null;
  emailLinkSentTo: string | null;
  isEmailLinkPending: boolean;
  hasAccess: (moduleId: string) => boolean;
  refreshAccesses: () => Promise<void>;
  loginGoogle: () => Promise<void>;
  sendAccessLink: (email: string) => Promise<void>;
  confirmAccessLink: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  resetLinkSent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [userAccesses, setUserAccesses] = useState<FirestoreUserAccess[]>([]);
  const [loadingAccesses, setLoadingAccesses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailLinkSentTo, setEmailLinkSentTo] = useState<string | null>(null);
  const [isEmailLinkPending, setIsEmailLinkPending] = useState(false);


  // Check if incoming URL is a Firebase email sign-in link
  useEffect(() => {
    async function handleIncomingEmailLink() {
      if (checkIsEmailSignInLink()) {
        const storedEmail = window.localStorage.getItem('emailForSignIn');
        if (storedEmail) {
          try {
            setLoading(true);
            const user = await completeEmailSignInLink(storedEmail);
            const profile = await syncUserProfile(user);
            setFirebaseUser(user);
            setUserProfile(profile);
          } catch (err: any) {
            console.error('Erro ao autenticar com link de e-mail:', err);
            setError(err.message || 'Falha ao autenticar com o link recebido. O link pode ter expirado.');
          } finally {
            setLoading(false);
          }
        } else {
          // Stored email is missing (e.g. user opened link in a different browser)
          setIsEmailLinkPending(true);
          setLoading(false);
        }
      }
    }

    handleIncomingEmailLink();
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Zero out accesses immediately on any auth state transition
      setUserAccesses([]);
      setFirebaseUser(currentUser);
      if (currentUser) {
        try {
          const profile = await syncUserProfile(currentUser);
          setUserProfile(profile);
        } catch (err: any) {
          console.error('Erro ao sincronizar perfil no Firestore:', err);
          // Fallback to basic profile from Firebase auth in case of network issue
          setUserProfile({
            uid: currentUser.uid,
            email: (currentUser.email || '').trim().toLowerCase(),
            name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuário',
            photoURL: currentUser.photoURL || '',
            active: true,
          });
        }
      } else {
        setUserProfile(null);
        setUserAccesses([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time module accesses for current user
  useEffect(() => {
    // CRITICAL: Immediately clear user accesses on ANY user change or effect rerun
    setUserAccesses([]);

    if (!firebaseUser) {
      setLoadingAccesses(false);
      return;
    }

    const userEmail = (firebaseUser.email || userProfile?.email || '').trim().toLowerCase();

    setLoadingAccesses(true);
    const unsubscribe = subscribeUserAccesses(
      firebaseUser.uid,
      userEmail,
      (accesses) => {
        setUserAccesses(accesses);
        setLoadingAccesses(false);
      },
      (err) => {
        console.error('Falha ao carregar acessos do usuário no Firestore:', err);
        setUserAccesses([]); // Clear accesses on error fail-closed
        setLoadingAccesses(false);
      }
    );

    return () => {
      unsubscribe();
      setUserAccesses([]); // Cancel subscription and wipe access memory
    };
  }, [firebaseUser?.uid, firebaseUser?.email, userProfile?.email]);

  /**
   * Check if user has active permission for a given module.
   * STRICT FAIL-SAFE:
   * - Requires authenticated firebaseUser
   * - Requires non-empty userAccesses
   * - Requires active === true
   * - Confirms record ownership matches current user's UID or verified email
   * - No demo bypass, no fallback true, no automatic BASE
   */
  const hasAccess = useCallback(
    (moduleId: string): boolean => {
      if (!firebaseUser || !userAccesses || userAccesses.length === 0) return false;
      const target = (moduleId || '').toUpperCase().trim();
      if (!target) return false;

      const userUid = firebaseUser.uid;
      const userEmail = (firebaseUser.email || '').trim().toLowerCase();

      return userAccesses.some((acc) => {
        if (!acc || acc.active !== true) return false;

        const recordUid = acc.userId ? String(acc.userId).trim() : null;
        const recordEmail = acc.email ? String(acc.email).trim().toLowerCase() : null;

        const isOwnedByCurrentUser =
          (recordUid !== null && recordUid === userUid) ||
          (recordEmail !== null && userEmail !== '' && recordEmail === userEmail);

        if (!isOwnedByCurrentUser) return false;

        const currentMod = (acc.moduleId || '').toUpperCase().trim();
        if (currentMod === target) return true;
        // Check aliases for TREINOSDIA and DIASSEMANA
        if (
          (target === 'TREINOSDIA' || target === 'DIASSEMANA') &&
          (currentMod === 'TREINOSDIA' || currentMod === 'DIASSEMANA')
        ) {
          return true;
        }
        return false;
      });
    },
    [firebaseUser, userAccesses]
  );

  /**
   * Atualização manual de acessos sob demanda (sincronização com Firestore)
   */
  const refreshAccesses = async () => {
    if (!firebaseUser) return;
    try {
      setLoadingAccesses(true);
      const email = firebaseUser.email || userProfile?.email || '';
      const data = await getUserAccesses(firebaseUser.uid, email);
      setUserAccesses(data);
    } catch (err: any) {
      console.error('Erro ao atualizar acessos:', err);
    } finally {
      setLoadingAccesses(false);
    }
  };

  /**
   * Send Passwordless Access Link to user's email

   */
  const sendAccessLink = async (email: string) => {
    try {
      setError(null);
      const trimmed = email.trim().toLowerCase();
      await sendEmailAccessLink(trimmed);
      setEmailLinkSentTo(trimmed);
    } catch (err: any) {
      console.error('Erro ao enviar link de acesso:', err);
      if (err.code === 'auth/invalid-email') {
        setError('Por favor, informe um endereço de e-mail válido.');
      } else if (err.code === 'auth/missing-email') {
        setError('O e-mail é obrigatório.');
      } else {
        setError(err.message || 'Não foi possível enviar o link de acesso. Verifique o e-mail e tente novamente.');
      }
      throw err;
    }
  };

  /**
   * Confirm email and complete sign-in when link is opened on another browser
   */
  const confirmAccessLink = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      const user = await completeEmailSignInLink(email);
      const profile = await syncUserProfile(user);
      setFirebaseUser(user);
      setUserProfile(profile);
      setIsEmailLinkPending(false);
    } catch (err: any) {
      console.error('Erro ao confirmar link de e-mail:', err);
      setError(err.message || 'Falha ao confirmar o link com o e-mail informado.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with Google (secondary option)
   */
  const loginGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await loginWithGoogle();
      const profile = await syncUserProfile(user);
      setFirebaseUser(user);
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Erro ao fazer login com Google:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('O login com Google foi cancelado antes da conclusão.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('A janela pop-up de login foi bloqueada pelo navegador. Permita pop-ups para continuar.');
      } else {
        setError(err.message || 'Falha ao autenticar com o Google. Tente novamente.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setUserAccesses([]);
      await logoutUser();
      setFirebaseUser(null);
      setUserProfile(null);
      setUserAccesses([]);
      setEmailLinkSentTo(null);
      setIsEmailLinkPending(false);
    } catch (err: any) {
      console.error('Erro ao sair:', err);
      setUserAccesses([]);
      setError('Erro ao encerrar a sessão.');
    }
  };

  const clearError = () => setError(null);
  const resetLinkSent = () => setEmailLinkSentTo(null);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        userAccesses,
        loading,
        loadingAccesses,
        error,
        emailLinkSentTo,
        isEmailLinkPending,
        hasAccess,
        refreshAccesses,
        loginGoogle,
        sendAccessLink,
        confirmAccessLink,
        logout,
        clearError,
        resetLinkSent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

