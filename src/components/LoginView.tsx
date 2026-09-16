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

  // Secondary Google login
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
    <div className="min-h-screen bg-[#08080a] text-[#ededf0] flex justify-center font-sans antialiased">
      <main
        id="login-container"
        className="w-full max-w-md min-h-screen bg-[#0c0c10] shadow-2xl relative flex flex-col justify-between border-x border-[#1e1e28] p-5 sm:p-6"
      >
        {/* Top Brand Header */}
        <div className="space-y-5 pt-4">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">
              Plataforma Digital
            </span>
            <h1 className="text-sm font-bold tracking-tight uppercase text-white">
              Base Visual <span className="text-[#e50914]">da Musculação</span>
            </h1>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
              Acesse sua conta
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consulte a biblioteca completa de exercícios, vídeos demonstrativos e guias práticos de execução técnica.
            </p>
          </div>

          {/* Quick value props list */}
          <div className="bg-[#13131a] border border-[#1e1e28] rounded-2xl p-3.5 space-y-2.5 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0c0c10] border border-[#23232d] flex items-center justify-center text-[#e50914] shrink-0">
                <Dumbbell size={16} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white uppercase">Exercícios Catalogados</h3>
                <p className="text-[11px] text-zinc-400">Páginas oficiais e grupamentos musculares</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0c0c10] border border-[#23232d] flex items-center justify-center text-[#e50914] shrink-0">
                <PlayCircle size={16} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white uppercase">Demonstrações em Vídeo</h3>
                <p className="text-[11px] text-zinc-400">Player otimizado e ajustado sem cortes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0c0c10] border border-[#23232d] flex items-center justify-center text-[#e50914] shrink-0">
                <BookOpen size={16} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white uppercase">Materiais e Manuais</h3>
                <p className="text-[11px] text-zinc-400">Acesso direto ao guia visual oficial</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="space-y-4 py-5">
          {/* Error Message */}
          {(error || validationError) && (
            <div
              id="login-error-alert"
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2.5 animate-in fade-in"
            >
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-200">Atenção</p>
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

          {/* Pending Email Confirmation state (User opened magic link in a new browser) */}
          {isEmailLinkPending ? (
            <div
              id="confirm-email-link-card"
              className="bg-[#13131a] border border-[#1e1e28] rounded-2xl p-4 space-y-3.5 shadow-md animate-in fade-in"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Mail size={16} className="text-[#e50914]" />
                  <span>Concluir acesso por link</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Detectamos que você abriu um link de acesso. Por segurança, confirme o seu e-mail para finalizar:
                </p>
              </div>

              <form onSubmit={handleConfirmEmailLink} className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="input-confirm-email"
                    className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider"
                  >
                    E-mail usado na compra
                  </label>
                  <input
                    id="input-confirm-email"
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    className="w-full bg-[#0c0c10] border border-[#23232d] focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] text-white text-xs rounded-xl px-3.5 py-3 outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <button
                  id="btn-confirm-access-link"
                  type="submit"
                  disabled={isConfirmingLink}
                  className="w-full bg-[#e50914] hover:bg-[#b80710] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isConfirmingLink ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Validando acesso...</span>
                    </>
                  ) : (
                    <>
                      <span>Concluir Acesso</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : emailLinkSentTo ? (
            /* Link Sent Confirmation State */
            <div
              id="link-sent-confirmation-card"
              className="bg-[#13131a] border border-green-500/30 rounded-2xl p-4 space-y-3.5 shadow-md animate-in fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0 mt-0.5">
                  <CheckCircle2 size={20} />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-xs font-bold text-white uppercase tracking-tight">
                    Enviamos seu link de acesso. Verifique seu e-mail.
                  </h3>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Um link de acesso direto sem senha foi enviado para{' '}
                    <span className="font-semibold text-white break-all">{emailLinkSentTo}</span>.
                  </p>
                </div>
              </div>

              <div className="bg-[#0c0c10] p-3 rounded-xl border border-[#23232d] text-[11px] text-zinc-400 leading-relaxed space-y-1">
                <p className="text-zinc-300 font-semibold">Como acessar:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-zinc-400">
                  <li>Abra o aplicativo de e-mail no seu celular ou computador;</li>
                  <li>Localize a mensagem da Base Visual da Musculação;</li>
                  <li>Toque no link de login para entrar automaticamente.</li>
                </ol>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  id="btn-resend-link"
                  onClick={() => handleSendLink({ preventDefault: () => {} } as any)}
                  disabled={isSendingLink}
                  className="flex-1 bg-[#0c0c10] hover:bg-[#1a1a24] border border-[#23232d] text-zinc-300 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw size={12} className={isSendingLink ? 'animate-spin' : ''} />
                  <span>{isSendingLink ? 'Reenviando...' : 'Reenviar link'}</span>
                </button>

                <button
                  id="btn-use-other-email"
                  onClick={resetLinkSent}
                  className="flex-1 bg-[#0c0c10] hover:bg-[#1a1a24] border border-[#23232d] text-zinc-400 text-[11px] font-bold uppercase tracking-wider py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
                >
                  Usar outro e-mail
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
                  E-mail usado na compra
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail size={15} />
                  </div>
                  <input
                    id="input-purchase-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    disabled={isSendingLink}
                    className="w-full bg-[#13131a] border border-[#23232d] focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] text-white text-xs rounded-xl pl-10 pr-3.5 py-3.5 outline-none transition-colors placeholder:text-zinc-600 disabled:opacity-60"
                  />
                </div>
                <p className="text-[10px] text-zinc-500">
                  O acesso é liberado por link seguro sem senha enviado para o seu e-mail.
                </p>
              </div>

              <button
                id="btn-send-access-link"
                type="submit"
                disabled={isSendingLink}
                className="w-full bg-[#e50914] hover:bg-[#b80710] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSendingLink ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>Enviando link de acesso...</span>
                  </>
                ) : (
                  <>
                    <span>ENVIAR LINK DE ACESSO</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#1e1e28]"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              ou continue com
            </span>
            <div className="flex-grow border-t border-[#1e1e28]"></div>
          </div>

          {/* Secondary Google Login Button */}
          <button
            id="btn-login-google"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSendingLink}
            className="w-full bg-[#13131a] hover:bg-[#1a1a24] active:scale-[0.99] border border-[#23232d] text-zinc-200 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 size={16} className="animate-spin text-zinc-300" />
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

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-0.5">
            <Shield size={12} className="text-zinc-500" />
            <span>Autenticação criptografada via Firebase</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center pt-2 pb-2">
          <p className="text-[10px] text-zinc-600 leading-relaxed max-w-xs mx-auto">
            O e-mail informado será utilizado para identificar seus conteúdos e módulos liberados.
          </p>
        </div>
      </main>
    </div>
  );
};
