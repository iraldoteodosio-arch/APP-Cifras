import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { UserProfile } from '../types/music';
import { Youtube } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'explore' | 'playlists' | 'favorites' | 'tests';
  onSelectTab: (tab: 'home' | 'explore' | 'playlists' | 'favorites' | 'tests') => void;
  onOpenTuner: () => void;
  onOpenMetronome: () => void;
  onOpenChords: () => void;
  onOpenSubscription: () => void;
  onOpenAddYoutube?: () => void;
  userProfile: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenTuner,
  onOpenMetronome,
  onOpenChords,
  onOpenSubscription,
  onOpenAddYoutube,
  userProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span className="text-emerald-400">Cantai</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'home' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => onSelectTab('explore')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'explore' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Explorar Louvores
          </button>
          <button
            onClick={() => onSelectTab('playlists')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'playlists' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => onSelectTab('favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'favorites' ? 'text-white font-semibold' : 'hover:text-white'
            }`}
          >
            Favoritos
          </button>
          <button
            onClick={() => onSelectTab('tests')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'tests' ? 'text-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Testes
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {onOpenAddYoutube && (
            <button
              onClick={onOpenAddYoutube}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              title="Adicionar louvor por link do YouTube"
            >
              <Youtube className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Cifrar do YouTube</span>
              <span className="sm:hidden">+ YouTube</span>
            </button>
          )}

          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>

          <button
            onClick={onOpenSubscription}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-emerald-500/20"
          >
            {userProfile.subscriptionStatus === 'premium' ? 'Plano Premium' : 'Experimentar Premium'}
          </button>
        </div>
      </div>
    </header>
  );
};
