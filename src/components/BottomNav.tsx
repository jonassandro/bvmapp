import React from 'react';
import { Home, Dumbbell, BookOpen, User, Users } from 'lucide-react';
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
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#120907]/95 backdrop-blur-md border-t border-[#2D2421] pb-safe"
    >
      <div className="max-w-md mx-auto px-2 py-2 grid grid-cols-5 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center transition-all duration-200 py-1.5 px-1 rounded-xl ${
                isActive
                  ? 'bg-[#1A1412] text-[#CC0000] border border-[#2D2421] shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 1.8}
                className={isActive ? 'text-[#CC0000]' : 'text-zinc-500'}
              />
              <span
                className={`text-[10px] mt-0.5 uppercase tracking-wider font-bold ${
                  isActive ? 'text-[#CC0000]' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
        <a
          id="nav-area-membros"
          href="https://base-visual-da-musculacao.members.wiapy.com"
          className="flex flex-col items-center justify-center transition-all duration-200 py-1.5 px-1 rounded-xl text-zinc-500 hover:text-zinc-300"
        >
          <Users size={20} strokeWidth={1.8} />
          <span className="text-[10px] mt-0.5 uppercase tracking-wider font-bold text-center leading-tight">
            Área de membros
          </span>
        </a>
      </div>
    </nav>
  );
};
