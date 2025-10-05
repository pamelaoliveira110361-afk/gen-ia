import React, { useState, FormEvent } from 'react';
import { DnaIcon } from '../components/icons/DnaIcon';
import * as LocalStorageService from '../services/localStorageService';
import type { User } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const user = LocalStorageService.loginUser(email, password);
        onLoginSuccess(user);
      } else {
        const user = LocalStorageService.registerUser(email, password);
        alert('Cadastro realizado com sucesso! Por favor, faça o login.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <DnaIcon className="w-10 h-10 text-emerald-custom-600" />
            <h1 className="text-4xl font-bold text-emerald-custom-800 tracking-tight">
              Analisador Genético
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Acesse sua conta para gerenciar suas análises.
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-700 text-center mb-6">{isLogin ? 'Login' : 'Cadastro'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-custom-500 focus:border-emerald-custom-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-slate-600">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-custom-500 focus:border-emerald-custom-500 sm:text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-custom-600 hover:bg-emerald-custom-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-custom-500 disabled:opacity-50"
              >
                {isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-medium text-emerald-custom-600 hover:text-emerald-custom-500 ml-1">
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>

        </main>
      </div>
    </div>
  );
};

export default AuthPage;
