import React from 'react';
import { Home, Dumbbell, BookOpen, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'inicio' as TabType, label: 'Início', icon: Home },
    { id: 'exercicios' as TabType, label: 'Exercícios', icon: Dumbbell },
    { id: 'conteudos' as TabType, label: 'Conteúdos', icon: BookOpen },
    { id: 'perfil' as TabType, label: 'Perfil', icon: User },
  ];

  return (
    <nav
      id="bottom-navigation"
      role="navigation"
      aria-label="Navegação Principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#120907] border-t border-[#2D2421]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors active:scale-95 ${
                isActive
                  ? 'text-[#CC0000] bg-[#1A1412]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
