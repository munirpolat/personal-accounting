
import React, { useState } from 'react';
import { Bill } from '../types';
import { Language, translations } from '../translations';
import { CATEGORY_KEYS } from '../constants';

interface BillTrackerProps {
  bills: Bill[];
  onAddBill: (bill: Partial<Bill>) => void;
  onPayBill: (bill: Bill) => void;
  onDeleteBill: (id: string) => void;
  lang: Language;
  currencySymbol: string;
}

export const BillTracker: React.FC<BillTrackerProps> = ({ bills, onAddBill, onPayBill, onDeleteBill, lang, currencySymbol }) => {
  const t = translations[lang];
  const [isAdding, setIsAdding] = useState(false);
  const [newBill, setNewBill] = useState<Partial<Bill>>({
    name: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'bills',
    isPaid: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.name || !newBill.amount) return;
    onAddBill(newBill);
    setIsAdding(false);
    setNewBill({
      name: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      category: 'bills',
      isPaid: false
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{t.billTracker}</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-indigo-700 shadow-md active:scale-95 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          <span>{t.newBill}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.billName}</label>
              <input 
                type="text" required
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                placeholder="Örn: Turkcell"
                value={newBill.name}
                onChange={e => setNewBill({...newBill, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.amount} ({currencySymbol})</label>
              <input 
                type="number" required
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                placeholder="0.00"
                value={newBill.amount || ''}
                onChange={e => setNewBill({...newBill, amount: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.dueDate}</label>
              <input 
                type="date" required
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
                value={newBill.dueDate}
                onChange={e => setNewBill({...newBill, dueDate: e.target.value})}
              />
            </div>
            <div className="flex items-end space-x-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">{t.save}</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">{t.cancel}</button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bills.map(bill => {
          const isOverdue = !bill.isPaid && new Date(bill.dueDate) < today;
          return (
            <div key={bill.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all ${bill.isPaid ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg transition-colors">{bill.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.categories[bill.category as keyof typeof t.categories] || bill.category}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${bill.isPaid ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : isOverdue ? 'bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {bill.isPaid ? t.paid : isOverdue ? t.overdue : t.pending}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{t.dueDate}</p>
                  <p className={`text-sm font-medium transition-colors ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>{bill.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 dark:text-slate-500">{t.amount}</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{currencySymbol}{bill.amount}</p>
                </div>
              </div>
              {!bill.isPaid && (
                <button 
                  onClick={() => onPayBill(bill)}
                  className="mt-4 w-full bg-emerald-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-sm active:scale-95"
                >
                  {t.payAndAdd}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
