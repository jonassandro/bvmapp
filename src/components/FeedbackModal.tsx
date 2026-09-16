import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
  defaultEmail?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultName = '',
  defaultEmail = '',
}) => {
  const [type, setType] = useState('Sugestão');
  const [message, setMessage] = useState('');
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div
      id="feedback-modal-backdrop"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="feedback-modal-card"
        className="w-full max-w-md bg-[#111116] border border-[#23232d] rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-1 border-b border-[#1e1e28]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a1a24] border border-[#262634] flex items-center justify-center text-[#e50914]">
              <MessageSquare size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-tight">
                Enviar Feedback
              </h2>
              <p className="text-[11px] text-zinc-400">Sugestões, dúvidas ou elogios</p>
            </div>
          </div>
          <button
            id="btn-close-feedback-modal"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1a24] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white uppercase">Feedback Enviado!</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Muito obrigado por sua mensagem. Nossa equipe de desenvolvimento agradece sua contribuição.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Tipo de Feedback
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['Sugestão', 'Dúvida', 'Problema', 'Outro'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setType(item)}
                    className={`py-1.5 text-[11px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                      type === item
                        ? 'bg-[#e50914]/15 border-[#e50914] text-white'
                        : 'bg-[#161620] border-[#23232d] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Sua Mensagem
              </label>
              <textarea
                id="input-feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva sua sugestão ou comentário..."
                rows={4}
                required
                className="w-full bg-[#161620] border border-[#23232d] focus:border-[#e50914] text-white text-xs rounded-xl p-3 outline-none transition-colors placeholder:text-zinc-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome"
                  className="w-full bg-[#161620] border border-[#23232d] text-white text-xs rounded-xl px-3 py-2 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Seu E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full bg-[#161620] border border-[#23232d] text-white text-xs rounded-xl px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#23232d] text-zinc-400 hover:text-white text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#b80710] text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Send size={14} />
                <span>Enviar</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
