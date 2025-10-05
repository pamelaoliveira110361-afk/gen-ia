import React, { useState, useEffect, useCallback } from 'react';
import type { User, Note } from './types';
import * as LocalStorageService from './services/localStorageService';
import AuthPage from './pages/AuthPage';
import AnalyzerPage from './pages/AnalyzerPage';
import NotesPage from './pages/NotesPage';
import Header from './components/Header';

type Page = 'analyzer' | 'notes';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('analyzer');
  const [noteDataForForm, setNoteDataForForm] = useState<Partial<Note> | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const sessionUser = LocalStorageService.checkSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setIsLoadingSession(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setPage('analyzer');
  };

  const handleLogout = () => {
    LocalStorageService.logout();
    setUser(null);
  };

  const handleNavigate = useCallback((targetPage: Page, data?: Partial<Note>) => {
    if (data) {
      setNoteDataForForm(data);
    } else {
      setNoteDataForForm(null);
    }
    setPage(targetPage);
  }, []);

  const clearInitialNoteData = useCallback(() => {
    setNoteDataForForm(null);
  }, []);

  if (isLoadingSession) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-emerald-custom-700 text-lg">Carregando sessão...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header user={user} onLogout={handleLogout} onNavigate={handleNavigate} activePage={page} />
      <main className="p-4 sm:p-6 md:p-8">
        {page === 'analyzer' && <AnalyzerPage user={user} onNavigate={handleNavigate} />}
        {page === 'notes' && <NotesPage user={user} initialNoteData={noteDataForForm} onClearInitialData={clearInitialNoteData} />}
      </main>
      <footer className="w-full max-w-4xl mx-auto mt-8 pb-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Soluções de IA. Todos os direitos reservados.</p>
        <p>Potencializado por tecnologia de ponta para o bem-estar animal.</p>
      </footer>
    </div>
  );
};

export default App;
