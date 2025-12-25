
import React, { useMemo } from 'react';
import { Transaction, Bill } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Language, translations } from '../translations';

interface DashboardProps {
  transactions: Transaction[];
  bills: Bill[];
  onPayBill: (bill: Bill) => void;
  lang: Language;
  currencySymbol: string;
}

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, bills, onPayBill, lang, currencySymbol }) => {
  const t = translations[lang];

  const stats = useMemo(() => {
    const income = transactions.filter(tr => tr.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(tr => tr.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const upcomingBills = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bills
      .filter(b => !b.isPaid)
      .map(b => ({
        ...b,
        isOverdue: new Date(b.dueDate) < today,
        isSoon: new Date(b.dueDate).getTime() - today.getTime() <= 86400000 * 5
      }))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [bills]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(tr => tr.type === 'EXPENSE').forEach(tr => {
      const catLabel = t.categories[tr.category as keyof typeof t.categories] || tr.category;
      data[catLabel] = (data[catLabel] || 0) + tr.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions, t]);

  return (
    <div className="space-y-6">
      {upcomingBills.some(b => b.isOverdue || b.isSoon) && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.urgentPayments}</h3>
          {upcomingBills.filter(b => b.isOverdue || b.isSoon).map(bill => (
            <div key={bill.id} className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border transition-colors ${bill.isOverdue ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'}`}>
              <div className="flex items-center space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bill.isOverdue ? 'bg-rose-100 dark:bg-rose-900/20 text-rose-600' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{bill.name}</p>
                  <p className={`text-xs font-medium ${bill.isOverdue ? 'text-rose-500' : 'text-amber-600'}`}>
                    {bill.isOverdue ? t.overdue : t.dueSoon} • {t.dueDate}: {bill.dueDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-4">
                <p className="font-bold text-slate-800 dark:text-slate-100">{currencySymbol}{bill.amount}</p>
                <button 
                  onClick={() => onPayBill(bill)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${bill.isOverdue ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                >
                  {t.payNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.totalBalance}</p>
          <p className={`text-3xl font-bold mt-1 ${stats.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {currencySymbol}{stats.balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.incomes}</p>
          <p className="text-3xl font-bold mt-1 text-emerald-500">
            {currencySymbol}{stats.income.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.expenses}</p>
          <p className="text-3xl font-bold mt-1 text-rose-500">
            {currencySymbol}{stats.expense.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-80 flex flex-col transition-colors">
          <h3 className="text-lg font-semibold dark:text-slate-100 mb-4">{t.expenseDistribution}</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-80 flex flex-col transition-colors">
          <h3 className="text-lg font-semibold dark:text-slate-100 mb-4">{t.recentTransactions}</h3>
          <div className="overflow-y-auto flex-1 pr-2 space-y-3">
            {transactions.slice().reverse().map(tr => (
              <div key={tr.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{tr.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.categories[tr.category as keyof typeof t.categories] || tr.category} • {new Date(tr.date).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-bold ${tr.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tr.type === 'INCOME' ? '+' : '-'}{currencySymbol}{tr.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
