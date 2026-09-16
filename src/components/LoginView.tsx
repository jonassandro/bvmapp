import React, { useState } from 'react';
import {
  Dumbbell,
  PlayCircle,
  BookOpen,
  AlertCircle,
  Loader2,
  Shield,
  Mail,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginView: React.FC = () => {
  const {
    loginGoogle,
    sendAccessLink,
    confirmAccessLink,
    emailLinkSentTo,
    isEmailLinkPending,
    error,
    clearError,
    resetLinkSent,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isConfirmingLink, setIsConfirmingLink] = useState(false);

  // Validate email format
  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  // Submit Passwordless Email Link
  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setValidationError('Informe o e-mail usado na compra.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setValidationError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    try {
      setIsSendingLink(true);
      await sendAccessLink(cleanEmail);
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsSendingLink(false);
    }
  };

  // Confirm email when user opens link from a different device/browser
  const handleConfirmEmailLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    const cleanEmail = confirmEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setValidationError('Informe o e-mail para validar o link recebido.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setValidationError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    try {
      setIsConfirmingLink(true);
      await confirmAccessLink(cleanEmail);
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsConfirmingLink(false);
    }
  };

  // Google Auth
  const handleGoogleLogin = async () => {
    setValidationError(null);
    clearError();
    try {
      setIsGoogleLoading(true);
      await loginGoogle();
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA] flex justify-center items-center font-sans antialiased p-4">
      <main
        id="login-container"
        className="w-full max-w-sm bg-[#120907] border border-[#2D2421] rounded-2xl p-6 shadow-2xl space-y-5"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-12 h-12 bg-[#CC0000] rounded-xl flex items-center justify-center font-extrabold text-white text-2xl mx-auto shadow-sm">
            B
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-bold tracking-tight uppercase text-white leading-tight">
              Base Visual <span className="text-[#CC0000]">da Musculação</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Entre ou cadastre-se com seu e-mail para acessar todos os conteúdos e guias
            </p>
          </div>
        </div>

        {/* Value Prop Card */}
        <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center shrink-0">
              <Dumbbell size={14} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white uppercase">149 Exercícios Ilustrados</h3>
              <p className="text-[11px] text-zinc-400">Com referência direta às páginas do livro</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center shrink-0">
              <PlayCircle size={14} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white uppercase">Demonstrações em Vídeo</h3>
              <p className="text-[11px] text-zinc-400">Execução técnica passo a passo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center shrink-0">
              <BookOpen size={14} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white uppercase">Materiais e Fichas</h3>
              <p className="text-[11px] text-zinc-400">Acesso aos PDFs e planilhas oficiais</p>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="space-y-3.5">
          {/* Error Message */}
          {(error || validationError) && (
            <div
              id="login-error-alert"
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2.5"
            >
              <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-red-200 uppercase text-[10px] tracking-wider">Atenção</p>
                <p className="text-[11px] text-red-300/90 mt-0.5 leading-relaxed">
                  {validationError || error}
                </p>
              </div>
              <button
                onClick={() => {
                  setValidationError(null);
                  clearError();
                }}
                className="text-red-400 hover:text-white text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Pending Email Confirmation state */}
          {isEmailLinkPending ? (
            <div
              id="confirm-email-link-card"
              className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 space-y-3 shadow-md animate-in fade-in"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Mail size={15} className="text-[#CC0000]" />
                  <span>Concluir acesso por link</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Confirme seu e-mail para validar o link seguro de acesso:
                </p>
              </div>

              <form onSubmit={handleConfirmEmailLink} className="space-y-3">
                <input
                  id="input-confirm-email"
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full bg-[#120907] border border-[#2D2421] focus:border-[#CC0000] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none transition-colors placeholder:text-zinc-500"
                />

                <button
                  id="btn-confirm-access-link"
                  type="submit"
                  disabled={isConfirmingLink}
                  className="w-full bg-[#CC0000] hover:bg-[#b30000] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isConfirmingLink ? (
                    <>
                      <Loader2 size={15} className="animate-spin text-white" />
                      <span>Validando acesso...</span>
                    </>
                  ) : (
                    <span>Concluir Acesso</span>
                  )}
                </button>
              </form>
            </div>
          ) : emailLinkSentTo ? (
            /* Link Sent Confirmation */
            <div
              id="magic-link-sent-card"
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-3 animate-in fade-in"
            >
              <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 size={15} />
                <span>Link Enviado com Sucesso</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                Enviamos um link de login para: <strong className="text-white font-mono">{emailLinkSentTo}</strong>
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  id="btn-resend-link"
                  onClick={() => handleSendLink({ preventDefault: () => {} } as any)}
                  disabled={isSendingLink}
                  className="flex-1 bg-[#1A1412] hover:bg-[#251d1a] border border-[#2D2421] text-zinc-300 text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw size={12} className={isSendingLink ? 'animate-spin' : ''} />
                  <span>Reenviar</span>
                </button>
                <button
                  id="btn-use-other-email"
                  onClick={resetLinkSent}
                  className="flex-1 bg-[#1A1412] hover:bg-[#251d1a] border border-[#2D2421] text-zinc-400 text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  Outro e-mail
                </button>
              </div>
            </div>
          ) : (
            /* Primary Passwordless Email Form */
            <form onSubmit={handleSendLink} className="space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="input-purchase-email"
                  className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider"
                >
                  Seu E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Mail size={14} />
                  </div>
                  <input
                    id="input-purchase-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    disabled={isSendingLink}
                    className="w-full bg-[#1A1412] border border-[#2D2421] focus:border-[#CC0000] text-white text-xs rounded-xl pl-9 pr-3.5 py-3 outline-none transition-colors placeholder:text-zinc-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                id="btn-send-access-link"
                type="submit"
                disabled={isSendingLink}
                className="w-full bg-[#CC0000] hover:bg-[#b30000] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSendingLink ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-white" />
                    <span>Enviando link seguro...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Link de Acesso</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#2D2421]"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              ou continue com
            </span>
            <div className="flex-grow border-t border-[#2D2421]"></div>
          </div>

          {/* Google Login Button */}
          <button
            id="btn-login-google"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSendingLink}
            className="w-full bg-[#1A1412] hover:bg-[#251d1a] active:scale-[0.99] border border-[#2D2421] text-zinc-200 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 size={15} className="animate-spin text-zinc-300" />
                <span>Autenticando com Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Entrar com Google</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-1">
            <Shield size={12} className="text-zinc-500" />
            <span>Autenticação criptografada via Firebase</span>
          </div>
        </div>
      </main>
    </div>
  );
};
