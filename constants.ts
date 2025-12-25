
import { Transaction, Bill, Account } from './types';

export const CATEGORY_KEYS = [
  'food', 'transport', 'entertainment', 'bills', 'rent', 'health', 'education', 'salary', 'freelance', 'bonus', 'investment', 'gift', 'other'
];

export const INCOME_CATEGORIES = ['salary', 'freelance', 'bonus', 'investment', 'gift', 'other'];
export const EXPENSE_CATEGORIES = ['food', 'transport', 'entertainment', 'bills', 'rent', 'health', 'education', 'other'];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc1',
    name: 'Bank Account',
    type: 'BANK',
    balance: 0,
    color: 'indigo'
  },
  {
    id: 'acc2',
    name: 'Credit Card',
    type: 'CREDIT_CARD',
    balance: 0,
    color: 'slate'
  },
  {
    id: 'acc3',
    name: 'Cash',
    type: 'CASH',
    balance: 0,
    color: 'emerald'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_BILLS: Bill[] = [];

export const MODEL_MAP = {
  text: 'gemini-3-flash-preview',
  complex: 'gemini-3-pro-preview',
  image: 'gemini-3-pro-image-preview',
  imageLite: 'gemini-2.5-flash-image',
  video: 'veo-3.1-fast-generate-preview',
  live: 'gemini-2.5-flash-native-audio-preview-09-2025',
  tts: 'gemini-2.5-flash-preview-tts',
  fast: 'gemini-flash-lite-latest'
};
