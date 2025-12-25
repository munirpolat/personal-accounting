
import { Transaction, Bill, Account } from './types';

export const CATEGORY_KEYS = [
  'food', 'transport', 'entertainment', 'bills', 'rent', 'health', 'education', 'salary', 'freelance', 'bonus', 'investment', 'gift', 'other'
];

export const INCOME_CATEGORIES = ['salary', 'freelance', 'bonus', 'investment', 'gift', 'other'];
export const EXPENSE_CATEGORIES = ['food', 'transport', 'entertainment', 'bills', 'rent', 'health', 'education', 'other'];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc1',
    name: 'Main Bank Account',
    type: 'BANK',
    balance: 4850,
    color: 'indigo'
  },
  {
    id: 'acc2',
    name: 'Visa Credit Card',
    type: 'CREDIT_CARD',
    balance: -200,
    color: 'slate'
  },
  {
    id: 'acc3',
    name: 'Cash',
    type: 'CASH',
    balance: 500,
    color: 'emerald'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 5000,
    category: 'salary',
    description: 'Monthly Salary',
    type: 'INCOME',
    date: new Date().toISOString(),
    accountId: 'acc1'
  },
  {
    id: '2',
    amount: 150,
    category: 'food',
    description: 'Grocery Shopping',
    type: 'EXPENSE',
    date: new Date().toISOString(),
    accountId: 'acc1'
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'b1',
    name: 'Electricity Bill',
    amount: 450,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    category: 'bills',
    isPaid: false
  }
];

export const MODEL_MAP = {
  text: 'gemini-3-flash-preview',
  complex: 'gemini-3-pro-preview',
  image: 'gemini-3-pro-image-preview',
  imageLite: 'gemini-2.5-flash-image',
  video: 'veo-3.1-fast-generate-preview',
  live: 'gemini-2.5-flash-native-audio-preview-09-2025',
  tts: 'gemini-2.5-flash-preview-tts',
  fast: 'gemini-2.5-flash-lite'
};
