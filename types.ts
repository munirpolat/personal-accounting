
export type TransactionType = 'INCOME' | 'EXPENSE';
export type AccountType = 'BANK' | 'CREDIT_CARD' | 'CASH';
export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'CAD';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
  date: string;
  accountId?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
}

export enum AIView {
  CHAT = 'CHAT',
  RECEIPT = 'RECEIPT'
}
