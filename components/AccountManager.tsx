
import React, { useState } from 'react';
import { Account, AccountType } from '../types';
import { Language, translations } from '../translations';

interface AccountManagerProps {
  accounts: Account[];
  onAddAccount: (acc: Partial<Account>) => void;
  lang: Language;
  currencySymbol: string;
}

export const AccountManager: React.FC<AccountManagerProps> = ({ accounts, onAddAccount, lang, currencySymbol }) => {
  const t = translations[lang];
  const [isAdding, setIsAdding] = useState(false);
  const [newAcc, setNewAcc] = useState<Partial<Account>>({
    name: '',
    type: 'BANK',
    balance: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcc.name) return;
    onAddAccount(newAcc);
    setIsAdding(false);
    setNewAcc({ name: '', type: 'BANK', balance: 0 });
  };

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case 'BANK':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
      case 'CREDIT_CARD':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>;
      case 'CASH':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>;
      default:
        return null;
    }
  };

  const getAccountColor = (type: AccountType) => {
    switch (type) {
      case 'BANK': return 'bg-indigo-500';
      case 'CREDIT_CARD': return 'bg-slate-500';
      case 'CASH': return 'bg-emerald-500';
      default: return 'bg-slate-300';
    }
  };

  const getAccountBg = (type: AccountType) => {
    switch (type) {
      case 'BANK': return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400';
      case 'CREDIT_CARD': return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
      case 'CASH': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-400';
    }
  };

  const getAccountLabel = (type: AccountType) => {
    switch (type) {
      case 'BANK': return t.bank;
      case 'CREDIT_CARD': return t.creditCard;
      case 'CASH': return t.cash;
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{t.accounts}</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-indigo-700 shadow-md transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          <span>{t.addAccount}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.accountName}</label>
              <input 
                type="text" required
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                placeholder="Örn: Nakit Cüzdan"
                value={newAcc.name}
                onChange={e => setNewAcc({...newAcc, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.accountType}</label>
              <select 
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                value={newAcc.type}
                onChange={e => setNewAcc({...newAcc, type: e.target.value as AccountType})}
              >
                <option value="BANK" className="dark:bg-slate-900">{t.bank}</option>
                <option value="CREDIT_CARD" className="dark:bg-slate-900">{t.creditCard}</option>
                <option value="CASH" className="dark:bg-slate-900">{t.cash}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.initialBalance}</label>
              <input 
                type="number" required
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                placeholder="0.00"
                value={newAcc.balance || ''}
                onChange={e => setNewAcc({...newAcc, balance: Number(e.target.value)})}
              />
            </div>
            <div className="flex items-end space-x-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">{t.save}</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">{t.cancel}</button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group transition-colors">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${getAccountColor(acc.type)}`}></div>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${getAccountBg(acc.type)}`}>
                {getAccountIcon(acc.type)}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                {getAccountLabel(acc.type)}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1 transition-colors">{acc.name}</h4>
            <p className={`text-2xl font-black ${acc.balance >= 0 ? 'text-slate-800 dark:text-slate-100' : 'text-rose-600'}`}>
              {currencySymbol}{acc.balance.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
