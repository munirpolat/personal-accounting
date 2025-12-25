import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { User } from '../types';

interface AuthProps {
  lang: Language;
  onLogin: (user: User) => void;
  theme: 'light' | 'dark';
}

export const Auth: React.FC<AuthProps> = ({ lang, onLogin, theme }) => {
  const t = translations[lang];
  const [view, setView] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('finanza_users') || '[]');
      const user = users.find((u: any) => u.username === formData.username && u.password === formData.password);
      
      if (user) {
        onLogin(user);
      } else {
        setError(t.invalidAuth);
      }
      setLoading(false);
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('finanza_users') || '[]');
      if (users.find((u: any) => u.username === formData.username)) {
        setError(t.userExists);
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        isVerified: true, // Auto-verified
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('finanza_users', JSON.stringify(users));
      
      onLogin(newUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100 dark:shadow-none border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-200 mb-4">F</div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.appName}</h1>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Smart Finance Assistant</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center animate-in shake duration-300">
            {error}
          </div>
        )}

        <form onSubmit={view === 'LOGIN' ? handleLogin : handleRegister} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">{t.username}</label>
            <input 
              type="text" required
              className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-indigo-500/30 dark:focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 font-bold text-slate-900 dark:text-slate-100 transition-all"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          {view === 'REGISTER' && (
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">{t.email}</label>
              <input 
                type="email" required
                className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-indigo-500/30 dark:focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 font-bold text-slate-900 dark:text-slate-100 transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">{t.password}</label>
            <input 
              type="password" required
              className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-indigo-500/30 dark:focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 font-bold text-slate-900 dark:text-slate-100 transition-all"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white p-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>{view === 'LOGIN' ? t.login : t.register}</span>
            )}
          </button>

          <div className="text-center pt-4">
            <button 
              type="button"
              onClick={() => setView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
              className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {view === 'LOGIN' ? t.noAccount : t.hasAccount} <span className="text-indigo-600 dark:text-indigo-400 underline decoration-2 underline-offset-4">{view === 'LOGIN' ? t.register : t.login}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};