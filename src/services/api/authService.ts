import type { 
  ApiResponse, 
  CardVerificationResult, 
  MemberProfile, 
  PhysicalMemberCard, 
  RegisterMemberPayload,
  AdminRole,
  AdminUser
} from '../../types';
import { initialPhysicalCards } from '../../mocks/cards';
import { initialMembersRegistry, primaryDemoMember } from '../../mocks/members';
import { mockAdminUsers } from '../../mocks/admins';
import { getFromStorage, saveToStorage } from './storageHelper';

const CARDS_STORAGE_KEY = 'physical_cards';
const MEMBERS_STORAGE_KEY = 'members_registry';
const AUTH_MEMBER_KEY = 'current_member_id';
const AUTH_ADMIN_KEY = 'current_admin_role';

export const authService = {
  // Step 1 & 2: Physical Card ID Verification lookup
  async verifyPhysicalCardId(cardId: string): Promise<ApiResponse<CardVerificationResult>> {
    // Simulate realistic network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanId = cardId.trim().toUpperCase();
    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const card = cards.find((c) => c.cardId.toUpperCase() === cleanId);

    if (!card) {
      return {
        success: false,
        message: 'Invalid Physical Member ID Card number. Please check the back of your card or contact the Secretariat.',
        data: {
          valid: false,
          cardId: cleanId,
          status: 'unassigned',
          reason: 'Card ID not found in cooperative physical inventory register.'
        }
      };
    }

    if (card.status === 'lost') {
      return {
        success: false,
        message: 'This Member ID Card has been reported lost or flagged for security replacement.',
        data: {
          valid: false,
          cardId: cleanId,
          status: 'lost',
          reason: 'Reported lost'
        }
      };
    }

    // Return card details for pre-filling registration form
    return {
      success: true,
      message: card.status === 'active' 
        ? 'Physical card is verified and already active. You can log in directly.'
        : 'Physical card verified! Details pre-filled from cooperative branch allocation.',
      data: {
        valid: true,
        cardId: card.cardId,
        status: card.status,
        prefill: {
          fullName: card.assignedMemberName,
          branch: card.branch,
          phone: card.assignedPhone,
          email: card.assignedEmail
        }
      }
    };
  },

  // Step 3: Account Creation
  async registerMember(payload: RegisterMemberPayload): Promise<ApiResponse<MemberProfile>> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);
    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);

    // Check if card is already registered
    const existing = members.find((m) => m.memberId.toUpperCase() === payload.cardId.toUpperCase());
    if (existing) {
      return {
        success: false,
        message: 'An account is already linked to this Physical Member ID Card. Please sign in.',
        data: existing
      };
    }

    const newMember: MemberProfile = {
      id: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      memberId: payload.cardId.toUpperCase(),
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      avatar: payload.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      kycVerified: true, // auto-verified via card batch + NIN
      kycDocuments: {
        idType: 'NIN',
        idNumber: payload.nin || '20938491028',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        status: 'verified',
        submittedAt: new Date().toISOString()
      },
      nextOfKin: payload.nextOfKin,
      bankDetails: {
        bankName: 'Access Bank PLC',
        accountNumber: '0281948192',
        accountName: payload.fullName.toUpperCase()
      },
      qrToken: `MOSUNMOLA-QR-${payload.cardId}-VERIFIED-${Date.now()}`,
      address: payload.address || 'Lagos, Nigeria',
      occupation: payload.occupation || 'Civil Servant / Entrepreneur'
    };

    // Update card status to active
    const updatedCards = cards.map((c) => 
      c.cardId.toUpperCase() === payload.cardId.toUpperCase()
        ? { ...c, status: 'active' as const, activationDate: new Date().toISOString().split('T')[0] }
        : c
    );

    saveToStorage(CARDS_STORAGE_KEY, updatedCards);
    saveToStorage(MEMBERS_STORAGE_KEY, [newMember, ...members]);
    saveToStorage(AUTH_MEMBER_KEY, newMember.id);

    return {
      success: true,
      message: 'Account successfully registered and activated with your Physical Member ID!',
      data: newMember
    };
  },

  // Simulated OTP verification
  async verifyOtp(code: string): Promise<ApiResponse<{ verified: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Any 6 digit code or sample code 894201
    if (code.length === 6) {
      return {
        success: true,
        message: 'OTP verified successfully! Your digital membership card is generated.',
        data: { verified: true }
      };
    }
    return {
      success: false,
      message: 'Invalid 6-digit OTP code. Enter any 6-digit number or 894201 to continue.',
      data: { verified: false }
    };
  },

  // Member Login
  async loginMember(identifier: string, _password?: string): Promise<ApiResponse<MemberProfile>> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanId = identifier.trim().toUpperCase();
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);
    
    // Look up by memberId (MCS-...) or email
    const member = members.find((m) => 
      m.memberId.toUpperCase() === cleanId || 
      m.email.toLowerCase() === identifier.trim().toLowerCase()
    );

    if (member) {
      saveToStorage(AUTH_MEMBER_KEY, member.id);
      return {
        success: true,
        message: `Welcome back, ${member.fullName}!`,
        data: member
      };
    }

    // If identifier matches chief Adeleke Balogun default
    if (cleanId === 'MCS-2026-8942' || identifier.includes('adeleke')) {
      saveToStorage(AUTH_MEMBER_KEY, primaryDemoMember.id);
      return {
        success: true,
        message: `Welcome back, ${primaryDemoMember.fullName}!`,
        data: primaryDemoMember
      };
    }

    return {
      success: false,
      message: 'Member not found. Please check your Member ID or register with your physical card.',
      data: primaryDemoMember // fallback demo
    };
  },

  // Get current active member session
  getCurrentMember(): MemberProfile {
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);
    const savedId = getFromStorage<string>(AUTH_MEMBER_KEY, primaryDemoMember.id);
    const member = members.find((m) => m.id === savedId);
    return member || primaryDemoMember;
  },

  // Admin Role Switch / Login
  async switchAdminRole(role: AdminRole): Promise<AdminUser> {
    saveToStorage(AUTH_ADMIN_KEY, role);
    const admin = mockAdminUsers.find((a) => a.role === role) || mockAdminUsers[0];
    return admin;
  },

  getCurrentAdminRole(): AdminRole {
    return getFromStorage<AdminRole>(AUTH_ADMIN_KEY, 'master_admin');
  },

  getCurrentAdmin(): AdminUser {
    const role = this.getCurrentAdminRole();
    return mockAdminUsers.find((a) => a.role === role) || mockAdminUsers[0];
  },

  logoutMember(): void {
    localStorage.removeItem('mosunmola_current_member_id');
  }
};
