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

  // Clear any residual test flags on startup
  useEffect(() => {
    try {
      window.sessionStorage.removeItem('TEST_MODE_ACTIVE');
      window.sessionStorage.removeItem('TEST_BYPASS_ALL');
    } catch {}
  }, []);


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
    const ALL_SYSTEM_MODULES: ValidModuleId[] = [
      'BASE',
      'APP_ACCESS',
      'TREINOS30',
      'PACK48',
      'PROGRAMA8',
      'TREINOSDIA',
      'NUTRICAO',
      'BONUS_MELHORES',
      'BONUS_CARGA',
    ];

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);

        // REGRA DE ACESSO COMPLETO: Todo usuário autenticado recebe todas as permissões ativas
        const userEmail = (currentUser.email || '').trim().toLowerCase();
        const fullAccesses: FirestoreUserAccess[] = ALL_SYSTEM_MODULES.map((mod) => ({
          id: `${currentUser.uid}_${mod}`,
          userId: currentUser.uid,
          email: userEmail,
          moduleId: mod,
          active: true,
          permissionName: mod,
          source: 'full_access',
        }));
        setUserAccesses(fullAccesses);
        setLoadingAccesses(false);

        try {
          const profile = await syncUserProfile(currentUser);
          setUserProfile(profile);
        } catch (err: any) {
          console.error('Erro ao sincronizar perfil no Firestore:', err);
          // Fallback to basic profile from Firebase auth in case of network issue
          setUserProfile({
            uid: currentUser.uid,
            email: userEmail,
            name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuário',
            photoURL: currentUser.photoURL || '',
            active: true,
          });
        }
      } else {
        setUserProfile(null);
        setFirebaseUser(null);
        setUserAccesses([]);
        setLoadingAccesses(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * REGRA FINAL DO SISTEMA:
   * SE O USUÁRIO ESTÁ AUTENTICADO = POSSUI ACESSO COMPLETO A TODO O APLICATIVO.
   * Não depende de webhooks, compras, SKUs ou permissões parciais.
   */
  const hasAccess = useCallback(
    (_moduleId?: string): boolean => {
      return Boolean(firebaseUser);
    },
    [firebaseUser]
  );

  /**
   * Atualização manual de acessos sob demanda (assegura estado liberado)
   */
  const refreshAccesses = async () => {
    if (!firebaseUser) return;
    const ALL_SYSTEM_MODULES: ValidModuleId[] = [
      'BASE',
      'APP_ACCESS',
      'TREINOS30',
      'PACK48',
      'PROGRAMA8',
      'TREINOSDIA',
      'NUTRICAO',
      'BONUS_MELHORES',
      'BONUS_CARGA',
    ];
    const userEmail = (firebaseUser.email || '').trim().toLowerCase();
    const fullAccesses: FirestoreUserAccess[] = ALL_SYSTEM_MODULES.map((mod) => ({
      id: `${firebaseUser.uid}_${mod}`,
      userId: firebaseUser.uid,
      email: userEmail,
      moduleId: mod,
      active: true,
      permissionName: mod,
      source: 'full_access',
    }));
    setUserAccesses(fullAccesses);
    setLoadingAccesses(false);
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

