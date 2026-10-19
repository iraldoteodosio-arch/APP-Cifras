import React, { useState } from 'react';
import { UserProfile } from '../types/music';
import { storageService } from '../services/storageService';
import { Check, Sparkles, Shield, Zap, Star } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  userProfile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  onClose,
  userProfile,
  onProfileUpdated,
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isCurrentPremium = userProfile.subscriptionStatus === 'premium';

  const handleTogglePlan = (plan: 'free' | 'premium') => {
    setIsUpgrading(true);
    setTimeout(() => {
      const updated: UserProfile = {
        ...userProfile,
        subscriptionStatus: plan,
      };
      storageService.saveUserProfile(updated);
      onProfileUpdated(updated);
      setIsUpgrading(false);
      setSuccessMsg(
        plan === 'premium'
          ? 'Plano Premium ativado com sucesso em modo demonstração!'
          : 'Plano revertido para Gratuito.'
      );
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Planos do Cantai</h2>
              <p className="text-xs text-slate-400">
                Seu louvor, seu violão, sua adoração sem interrupções
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Plan */}
            <div
              className={`rounded-2xl p-5 border flex flex-col justify-between ${
                !isCurrentPremium
                  ? 'bg-slate-950/80 border-slate-700 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">Gratuito</h3>
                  {!isCurrentPremium && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      Plano Atual
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black font-mono text-white mb-4">
                  R$ 0<span className="text-xs text-slate-400 font-normal"> / para sempre</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Acesso a todos os louvores demonstrativos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sincronização em tempo real & rolagem</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Transposição de tom e Capotraste</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Metrônomo e Afinador Cromático</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até 3 playlists de ensaio</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  disabled={!isCurrentPremium}
                  onClick={() => handleTogglePlan('free')}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    !isCurrentPremium
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {!isCurrentPremium ? 'Seu Plano Atual' : 'Mudar para Gratuito'}
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div
              className={`rounded-2xl p-5 border relative flex flex-col justify-between ${
                isCurrentPremium
                  ? 'bg-emerald-950/20 border-emerald-500 shadow-xl shadow-emerald-950/30'
                  : 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/40 shadow-lg'
              }`}
            >
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wide uppercase shadow">
                Recomendado
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-emerald-400 fill-current" />
                    <span>Premium Adorador</span>
                  </h3>
                  {isCurrentPremium && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                      Ativo
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400 mb-4">
                  R$ 14,90<span className="text-xs text-slate-400 font-normal"> / mês</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Playlists ilimitadas para cultos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Upload e sincronização de áudios próprios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exportação de cifras e repertório em PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Modo ensaio com isolamento de compasso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sincronização na nuvem multi-dispositivos</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <button
                  disabled={isUpgrading}
                  onClick={() => handleTogglePlan(isCurrentPremium ? 'free' : 'premium')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isCurrentPremium ? 'Gerenciar Assinatura' : 'Experimentar Premium (Modo Demo)'}
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            * Ambiente de testes preparado para integração com gateway de pagamentos (Stripe / Mercado Pago). Nenhuma cobrança real será realizada.
          </p>
        </div>
      </div>
    </div>
  );
};
