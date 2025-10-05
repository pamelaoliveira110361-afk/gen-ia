import React from 'react';
import type { User } from '../types';
import { DnaIcon } from './icons/DnaIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: 'analyzer' | 'notes') => void;
  activePage: 'analyzer' | 'notes';
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate, activePage }) => {
  const navItemClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const activeClasses = "bg-emerald-custom-100 text-emerald-custom-800";
  const inactiveClasses = "text-slate-600 hover:bg-slate-200";

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <DnaIcon className="w-8 h-8 text-emerald-custom-600" />
            <h1 className="text-xl font-bold text-emerald-custom-800 hidden sm:block">
              Analisador Genético
            </h1>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => onNavigate('analyzer')} 
              className={`${navItemClasses} ${activePage === 'analyzer' ? activeClasses : inactiveClasses}`}
            >
              Analisador
            </button>
            <button 
              onClick={() => onNavigate('notes')}
              className={`${navItemClasses} ${activePage === 'notes' ? activeClasses : inactiveClasses}`}
            >
              Minhas Anotações
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden md:block" title={user.email}>
              Olá, <span className="font-medium">{user.email.split('@')[0]}</span>
            </span>
            <button
              onClick={onLogout}
              title="Sair"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
