import React from 'react';
import { Home, Dumbbell, BookOpen, User, CalendarDays } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'inicio' as TabType, label: 'Início', icon: Home },
    { id: 'treinos' as TabType, label: 'Treinos', icon: CalendarDays },
    { id: 'exercicios' as TabType, label: 'Exercícios', icon: Dumbbell },
    { id: 'conteudos' as TabType, label: 'Conteúdos', icon: BookOpen },
    { id: 'perfil' as TabType, label: 'Perfil', icon: User },
  ];

  return (
    <nav
      id="bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c10]/95 backdrop-blur-xl border-t border-[#23232d] pb-safe shadow-2xl"
    >
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center transition-all duration-200 min-h-[44px] min-w-[50px] py-1 px-2 rounded-xl cursor-pointer ${
                isActive
                  ? 'bg-[#15151e] text-white border border-[#2b2b38] shadow-md shadow-red-950/20'
                  : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              <Icon
                size={19}
                strokeWidth={isActive ? 2.4 : 1.8}
                className={isActive ? 'text-[#e50914]' : 'text-zinc-400'}
              />
              <span
                className={`text-[9px] mt-0.5 uppercase tracking-wider font-bold ${
                  isActive ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

