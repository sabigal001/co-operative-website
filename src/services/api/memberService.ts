import type { ApiResponse, MemberProfile, Transaction } from '../../types';
import { initialMembersRegistry, primaryDemoMember } from '../../mocks/members';
import { initialTransactions } from '../../mocks/transactions';
import { getFromStorage, saveToStorage } from './storageHelper';

const MEMBERS_STORAGE_KEY = 'members_registry';
const TXN_STORAGE_KEY = 'transactions_registry';

export const memberService = {
  async getProfile(memberId: string): Promise<ApiResponse<MemberProfile>> {
    await new Promise((r) => setTimeout(r, 300));
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);
    const member = members.find((m) => m.id === memberId || m.memberId === memberId) || primaryDemoMember;
    return {
      success: true,
      message: 'Member profile loaded successfully.',
      data: member
    };
  },

  async updateProfile(memberId: string, updates: Partial<MemberProfile>): Promise<ApiResponse<MemberProfile>> {
    await new Promise((r) => setTimeout(r, 500));
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);
    
    let updatedMember = primaryDemoMember;
    const updatedList = members.map((m) => {
      if (m.id === memberId || m.memberId === memberId) {
        updatedMember = { ...m, ...updates };
        return updatedMember;
      }
      return m;
    });

    saveToStorage(MEMBERS_STORAGE_KEY, updatedList);
    return {
      success: true,
      message: 'Profile details updated successfully.',
      data: updatedMember
    };
  },

  async getTransactions(memberId: string): Promise<ApiResponse<Transaction[]>> {
    await new Promise((r) => setTimeout(r, 400));
    const allTxns = getFromStorage<Transaction[]>(TXN_STORAGE_KEY, initialTransactions);
    const memberTxns = allTxns.filter((t) => t.memberId === memberId || t.memberId === 'MCS-2026-8942');
    return {
      success: true,
      message: 'Transactions retrieved successfully.',
      data: memberTxns
    };
  },

  async getReceiptData(transactionId: string): Promise<ApiResponse<Transaction | null>> {
    await new Promise((r) => setTimeout(r, 200));
    const allTxns = getFromStorage<Transaction[]>(TXN_STORAGE_KEY, initialTransactions);
    const txn = allTxns.find((t) => t.id === transactionId);
    if (!txn) {
      return {
        success: false,
        message: 'Transaction receipt not found.',
        data: null
      };
    }
    return {
      success: true,
      message: 'Receipt loaded.',
      data: txn
    };
  }
};
