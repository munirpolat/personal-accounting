
import React from 'react';
import { translations } from '../translations';
import { Currency, Theme } from '../types';

interface SettingsProps {
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onUpdateRates: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  currency, onCurrencyChange, 
  theme, onThemeChange,
  onUpdateRates 
}) => {
  const t = translations['en'];

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
    { code: 'TRY', symbol: '₺', label: 'Turkish Lira' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Theme Section */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
            {theme === 'light' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            )}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.theme}</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Appearance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onThemeChange('light')}
            className={`p-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center space-y-2 ${theme === 'light' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}
          >
            <span className="text-2xl">☀️</span>
            <span className={`font-bold ${theme === 'light' ? 'text-amber-600' : 'text-slate-600 dark:text-slate-400'}`}>{t.lightTheme}</span>
          </button>
          <button 
            onClick={() => onThemeChange('dark')}
            className={`p-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center space-y-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}
          >
            <span className="text-2xl">🌙</span>
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t.darkTheme}</span>
          </button>
        </div>
      </section>

      {/* Currency Section */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.currency}</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Auto-Updating Rates</p>
            </div>
          </div>
          <button 
            onClick={onUpdateRates}
            className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:rotate-180 duration-500"
            title="Refresh Rates"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {currencies.map((curr) => (
            <button 
              key={curr.code}
              onClick={() => onCurrencyChange(curr.code)}
              className={`p-4 rounded-[1.5rem] border-2 transition-all flex flex-col items-center space-y-2 ${currency === curr.code ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}
            >
              <span className="text-xl font-black dark:text-slate-100">{curr.symbol}</span>
              <span className={`text-[10px] font-bold ${currency === curr.code ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{curr.code}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
