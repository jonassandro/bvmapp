import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { FeedbackSubmission } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName: string;
  defaultEmail: string;
}

const FEEDBACK_TYPES: FeedbackSubmission['type'][] = [
  'Sugestão',
  'Erro encontrado',
  'Pedido de novo exercício',
  'Problema com vídeo',
  'Problema com acesso',
  'Outro',
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultName,
  defaultEmail,
}) => {
  const [type, setType] = useState<FeedbackSubmission['type']>('Sugestão');
  const [message, setMessage] = useState('');
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Simulate saving locally
    const newFeedback: FeedbackSubmission = {
      id: 'FB' + Date.now(),
      type,
      message,
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('bmv_feedback');
      const list = stored ? JSON.parse(stored) : [];
      list.push(newFeedback);
      localStorage.setItem('bmv_feedback', JSON.stringify(list));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <div
      id="feedback-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        id="feedback-modal"
        className="w-full max-w-md bg-[#120907] border border-[#2D2421] rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#2D2421] pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Enviar feedback</h2>
          <button
            id="btn-close-feedback"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 size={42} className="text-green-500 mx-auto animate-bounce" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Feedback recebido!</h3>
            <p className="text-xs text-zinc-400">
              Obrigado por ajudar a aprimorar a Base Visual da Musculação.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Tipo de feedback
              </label>
              <select
                id="feedback-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackSubmission['type'])}
                className="w-full bg-[#1A1412] border border-[#2D2421] rounded-xl px-3 py-2.5 text-[#EAEAEA] focus:outline-none focus:border-[#CC0000] transition-colors"
              >
                {FEEDBACK_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#120907] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                Mensagem *
              </label>
              <textarea
                id="feedback-message-input"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva detalhadamente sua sugestão ou observação..."
                className="w-full bg-[#1A1412] border border-[#2D2421] rounded-xl p-3 text-[#EAEAEA] placeholder-zinc-500 focus:outline-none focus:border-[#CC0000] resize-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Nome
                </label>
                <input
                  id="feedback-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1A1412] border border-[#2D2421] rounded-xl px-3 py-2 text-[#EAEAEA] focus:outline-none focus:border-[#CC0000] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  E-mail
                </label>
                <input
                  id="feedback-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1A1412] border border-[#2D2421] rounded-xl px-3 py-2 text-[#EAEAEA] focus:outline-none focus:border-[#CC0000] transition-colors"
                />
              </div>
            </div>

            <button
              id="btn-submit-feedback"
              type="submit"
              className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 mt-2"
            >
              <Send size={14} />
              <span>Enviar Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
