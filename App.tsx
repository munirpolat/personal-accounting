import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { BillTracker } from './components/BillTracker';
import { AccountManager } from './components/AccountManager';
import { Settings } from './components/Settings';
import { Auth } from './components/Auth';
import { Transaction, TransactionType, Bill, Account, Currency, Theme, User } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_BILLS, INITIAL_ACCOUNTS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from './constants';
import { translations } from './translations';
import { fetchExchangeRates } from './services/geminiService';

const App: React.FC = () => {
  // Global App Config
  const lang = 'en'; 
  const [currency, setCurrency] = useState<Currency>('TRY');
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('finanza_theme') as Theme) || 'light';
  });
  const [user, setUser] = useState<User | null>(null);
  
  // Finance Data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'AI' | 'BILLS' | 'ACCOUNTS' | 'SETTINGS'>('DASHBOARD');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({ TRY: 1, USD: 34, EUR: 37, GBP: 44, CAD: 25 });
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);
  const t = translations[lang];

  // Theme synchronization
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('finanza_theme', theme);
  }, [theme]);

  // Load Session
  useEffect(() => {
    const savedUser = localStorage.getItem('finanza_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load User Data when logged in
  useEffect(() => {
    if (user) {
      const userDataKey = `finanza_data_${user.id}`;
      const savedData = localStorage.getItem(userDataKey);
      if (savedData) {
        const { transactions, bills, accounts } = JSON.parse(savedData);
        setTransactions(transactions);
        setBills(bills);
        setAccounts(accounts);
      } else {
        setTransactions(INITIAL_TRANSACTIONS);
        setBills(INITIAL_BILLS);
        setAccounts(INITIAL_ACCOUNTS);
      }
    }
  }, [user]);

  // Persist Data
  useEffect(() => {
    if (user) {
      const userDataKey = `finanza_data_${user.id}`;
      const dataToSave = { transactions, bills, accounts };
      localStorage.setItem(userDataKey, JSON.stringify(dataToSave));
    }
  }, [transactions, bills, accounts, user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('finanza_current_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('finanza_current_user');
    setActiveTab('DASHBOARD');
  };

  const currencySymbol = useMemo(() => {
    switch (currency) {
      case 'TRY': return '₺';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'CAD': return 'C$';
      default: return '$';
    }
  }, [currency]);

  const updateRates = useCallback(async () => {
    setIsUpdatingRates(true);
    try {
      const newRates = await fetchExchangeRates();
      if (newRates && newRates.USD > 1) setRates(newRates);
    } catch (e) {
      console.error("Failed to update rates", e);
    } finally {
      setIsUpdatingRates(false);
    }
  }, []);

  useEffect(() => {
    updateRates();
    const interval = setInterval(updateRates, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [updateRates]);
  
  const convertValue = useCallback((val: number, toDisplay: boolean = true) => {
    const rate = rates[currency] || 1;
    return toDisplay ? Number((val / rate).toFixed(2)) : Number((val * rate).toFixed(2));
  }, [currency, rates]);

  const displayTransactions = useMemo(() => transactions.map(tr => ({ ...tr, amount: convertValue(tr.amount, true) })), [transactions, convertValue]);
  const displayAccounts = useMemo(() => accounts.map(acc => ({ ...acc, balance: convertValue(acc.balance, true) })), [accounts, convertValue]);
  const displayBills = useMemo(() => bills.map(b => ({ ...b, amount: convertValue(b.amount, true) })), [bills, convertValue]);

  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    amount: 0,
    category: EXPENSE_CATEGORIES[0],
    type: 'EXPENSE',
    description: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddTransaction = (tr?: Partial<Transaction>, isAlreadyInBase: boolean = false) => {
    const finalTx = tr || newTx;
    if (!finalTx.amount || !finalTx.description || !finalTx.accountId) return;

    const amountInTry = isAlreadyInBase ? Number(finalTx.amount) : convertValue(Number(finalTx.amount), false);

    const tx: Transaction = {
      id: Date.now().toString(),
      amount: amountInTry,
      category: finalTx.category || (finalTx.type === 'INCOME' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
      description: finalTx.description || '',
      type: finalTx.type as TransactionType || 'EXPENSE',
      date: finalTx.date || new Date().toISOString(),
      accountId: finalTx.accountId
    };

    setTransactions(prev => [...prev, tx]);
    setAccounts(prev => prev.map(acc => acc.id === tx.accountId ? { ...acc, balance: Number((acc.balance + (tx.type === 'INCOME' ? tx.amount : -tx.amount)).toFixed(2)) } : acc));
    setIsAddModalOpen(false);
    setNewTx({ amount: 0, category: EXPENSE_CATEGORIES[0], type: 'EXPENSE', description: '', accountId: accounts[0]?.id || '', date: new Date().toISOString().split('T')[0] });
  };

  if (!user) {
    return <Auth lang={lang} theme={theme} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <aside className="hidden lg:flex flex-col w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 fixed left-0 top-0 p-6 z-10 transition-colors">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 ring-4 ring-indigo-50 dark:ring-indigo-900/20">F</div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">{t.appName}</h1>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Hello, {user.username}</p>
          </div>
        </div>
        
        <nav className="space-y-1.5 flex-1">
          <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="font-bold">{t.dashboard}</span>
          </button>
          <button onClick={() => setActiveTab('ACCOUNTS')} className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all ${activeTab === 'ACCOUNTS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            <span className="font-bold">{t.accounts}</span>
          </button>
          <button onClick={() => setActiveTab('BILLS')} className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all ${activeTab === 'BILLS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            <span className="font-bold">{t.bills}</span>
          </button>
          <button onClick={() => setActiveTab('AI')} className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all ${activeTab === 'AI' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span className="font-bold">{t.assistant}</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button onClick={() => setActiveTab('SETTINGS')} className={`w-full flex items-center space-x-3 p-3.5 rounded-2xl transition-all ${activeTab === 'SETTINGS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="font-bold">{t.settings}</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span className="font-bold">{t.logout}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-5 lg:p-10 max-w-6xl mx-auto w-full">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {activeTab === 'DASHBOARD' ? t.dashboard : activeTab === 'BILLS' ? t.billTracker : activeTab === 'ACCOUNTS' ? t.accounts : activeTab === 'SETTINGS' ? t.settings : t.assistant}
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl flex items-center space-x-2 hover:bg-indigo-700 shadow-xl transition-all active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            <span className="hidden sm:inline font-black tracking-tight">{t.addTransaction}</span>
          </button>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'DASHBOARD' ? <Dashboard transactions={displayTransactions} bills={displayBills} onPayBill={(bill) => { setBills(prev => prev.map(b => b.id === bill.id ? { ...b, isPaid: true } : b)); handleAddTransaction({ amount: bill.amount, category: bill.category, description: `${bill.name} Payment`, type: 'EXPENSE', accountId: accounts[0]?.id, date: new Date().toISOString() }, true); }} lang={lang} currencySymbol={currencySymbol} /> 
           : activeTab === 'BILLS' ? <BillTracker bills={displayBills} onAddBill={(b) => setBills(prev => [...prev, { ...b, id: Date.now().toString(), amount: convertValue(Number(b.amount), false), isPaid: false } as Bill])} onPayBill={(bill) => { setBills(prev => prev.map(b => b.id === bill.id ? { ...b, isPaid: true } : b)); handleAddTransaction({ amount: bill.amount, category: bill.category, description: `${bill.name} Payment`, type: 'EXPENSE', accountId: accounts[0]?.id, date: new Date().toISOString() }, true); }} onDeleteBill={(id) => setBills(bills.filter(b => b.id !== id))} lang={lang} currencySymbol={currencySymbol} /> 
           : activeTab === 'ACCOUNTS' ? <AccountManager accounts={displayAccounts} onAddAccount={(acc) => setAccounts(prev => [...prev, { ...acc, id: Date.now().toString(), balance: convertValue(Number(acc.balance), false), color: 'indigo' } as Account])} lang={lang} currencySymbol={currencySymbol} /> 
           : activeTab === 'SETTINGS' ? <Settings currency={currency} onCurrencyChange={setCurrency} theme={theme} onThemeChange={setTheme} onUpdateRates={updateRates} /> 
           : <AIAssistant onAddTransaction={handleAddTransaction} lang={lang} />}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-4 pb-8 flex justify-around items-center mobile-bottom-nav z-20 shadow-2xl rounded-t-[2.5rem] transition-colors">
        <button onClick={() => setActiveTab('DASHBOARD')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'DASHBOARD' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span className="text-[10px] font-black mt-1 uppercase">{t.dashboard}</span>
        </button>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-3xl text-white shadow-xl -mt-14 border-4 border-white dark:border-slate-900 active:scale-90 transition-transform">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        </button>
        <button onClick={() => setActiveTab('SETTINGS')} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === 'SETTINGS' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="text-[10px] font-black mt-1 uppercase">{t.settings}</span>
        </button>
      </nav>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl ring-1 ring-slate-100 dark:ring-slate-800 transition-colors">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.newTransaction}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl flex relative">
                <button onClick={() => setNewTx({...newTx, type: 'EXPENSE'})} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all relative z-10 ${newTx.type === 'EXPENSE' ? 'text-white' : 'text-slate-400'}`}>{t.expense}</button>
                <button onClick={() => setNewTx({...newTx, type: 'INCOME'})} className={`flex-1 py-3 rounded-xl text-sm font-black transition-all relative z-10 ${newTx.type === 'INCOME' ? 'text-white' : 'text-slate-400'}`}>{t.income}</button>
                <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-300 ${newTx.type === 'EXPENSE' ? 'left-1.5 bg-rose-500' : 'left-[calc(50%+3px)] bg-emerald-500'}`} />
              </div>
              <input type="text" className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-indigo-500/30 text-slate-900 dark:text-slate-100 font-semibold transition-all" placeholder={t.description} value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-indigo-500/30 font-black text-xl text-slate-900 dark:text-slate-100" placeholder="0.00" value={newTx.amount || ''} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} />
                <select className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-indigo-500/30 font-bold text-slate-900 dark:text-slate-100" value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})}>
                  {(newTx.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(key => <option key={key} value={key}>{t.categories[key as keyof typeof t.categories]}</option>)}
                </select>
              </div>
              <select className="w-full p-4.5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-indigo-500/30 font-bold text-slate-900 dark:text-slate-100" value={newTx.accountId} onChange={e => setNewTx({...newTx, accountId: e.target.value})}>
                <option value="" disabled>{t.selectAccount}</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
              </select>
              <button onClick={() => handleAddTransaction()} className={`w-full text-white p-5 rounded-[1.5rem] font-black text-lg transition-all active:scale-[0.97] ${newTx.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;