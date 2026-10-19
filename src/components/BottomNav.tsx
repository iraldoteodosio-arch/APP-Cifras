import React from 'react';
import { Home, Compass, ListMusic, Heart, Wrench } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'explore' | 'playlists' | 'favorites' | 'tests';
  onSelectTab: (tab: 'home' | 'explore' | 'playlists' | 'favorites' | 'tests') => void;
  onOpenToolsSheet: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenToolsSheet,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-2">
        {/* Início */}
        <button
          onClick={() => onSelectTab('home')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            currentTab === 'home' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Início</span>
        </button>

        {/* Explorar */}
        <button
          onClick={() => onSelectTab('explore')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            currentTab === 'explore' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Explorar</span>
        </button>

        {/* Playlists */}
        <button
          onClick={() => onSelectTab('playlists')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            currentTab === 'playlists' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListMusic className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Playlists</span>
        </button>

        {/* Favoritos */}
        <button
          onClick={() => onSelectTab('favorites')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            currentTab === 'favorites' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Favoritos</span>
        </button>

        {/* Ferramentas */}
        <button
          onClick={onOpenToolsSheet}
          className="min-h-[44px] flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Ferramentas</span>
        </button>
      </div>
    </nav>
  );
};
