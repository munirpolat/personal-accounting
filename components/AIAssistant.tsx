import React, { useState, useRef } from 'react';
import { analyzeReceipt, chatWithThinking, searchFinancialData } from '../services/geminiService';
import { AIView, Transaction } from '../types';
import { Language, translations } from '../translations';

interface AIAssistantProps {
  onAddTransaction: (tr: Partial<Transaction>) => void;
  lang: Language;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onAddTransaction, lang }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<AIView>(AIView.CHAT);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, sources?: any[] }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChat = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      let result;
      const lowerInput = userMsg.toLowerCase();
      const searchKeywords = lang === 'tr' ? ['güncel', 'nedir', 'haber'] : ['current', 'what is', 'news', 'price'];
      
      if (searchKeywords.some(kw => lowerInput.includes(kw))) {
        result = await searchFinancialData(userMsg, lang);
        setMessages(prev => [...prev, { role: 'ai', content: result.text || '', sources: result.sources }]);
      } else {
        const text = await chatWithThinking(userMsg, lang);
        setMessages(prev => [...prev, { role: 'ai', content: text }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const data = await analyzeReceipt(base64, lang);
        onAddTransaction({
          amount: data.amount,
          category: data.category,
          description: data.description,
          type: 'EXPENSE',
          date: new Date().toISOString()
        });
        const successMsg = t.receiptSuccess.replace('{desc}', data.description).replace('{amount}', data.amount.toString());
        setMessages(prev => [...prev, { role: 'ai', content: successMsg }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', content: lang === 'tr' ? "Fiş okunurken bir hata oluştu." : "Error reading receipt." }]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="flex bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 p-1 overflow-x-auto">
        {[
          { id: AIView.CHAT, label: t.assistant },
          { id: AIView.RECEIPT, label: t.receiptScan }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AIView)}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === AIView.CHAT && (
          <>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'}`}>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                      <p className="font-semibold mb-1">Sources:</p>
                      {m.sources.map((s, idx) => (
                        <a key={idx} href={s.web?.uri} target="_blank" rel="noreferrer" className="block text-indigo-500 dark:text-indigo-400 hover:underline">
                          {s.web?.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="animate-pulse text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest">{t.aiThinking}</div>}
          </>
        )}

        {activeTab === AIView.RECEIPT && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-4">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.receiptScan}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">{t.receiptDesc}</p>
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleReceiptUpload} />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {loading ? t.analyzing : t.selectImage}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex space-x-2 transition-colors">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleChat()}
          placeholder={t.aiPlaceholder}
          className="flex-1 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button
          onClick={handleChat}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 shadow-md active:scale-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    </div>
  );
};