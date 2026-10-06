import type { 
  ApiResponse, 
  CardLookupResponse, 
  MemberProfile, 
  PhysicalMemberCard 
} from '../../types';
import { initialPhysicalCards } from '../../mocks/cards';
import { initialMembersRegistry } from '../../mocks/members';
import { getFromStorage, saveToStorage } from './storageHelper';
import { adminService } from './adminService';

const CARDS_STORAGE_KEY = 'physical_cards';
const MEMBERS_STORAGE_KEY = 'members_registry';
const AUTH_MEMBER_KEY = 'current_member_id';

function maskPhone(phone?: string): string {
  if (!phone) return '+234 80* *** ****';
  const clean = phone.trim();
  if (clean.length < 8) return '****';
  return clean.slice(0, 7) + ' *** ' + clean.slice(-4);
}

function maskEmail(email?: string): string {
  if (!email) return 'm*****@domain.ng';
  const parts = email.split('@');
  if (parts.length !== 2) return '*****@domain.ng';
  const user = parts[0];
  const domain = parts[1];
  const maskedUser = user.length > 2 ? user[0] + '****' + user[user.length - 1] : user[0] + '****';
  return `${maskedUser}@${domain}`;
}

export const cardService = {
  // Step 1: Card Lookup by Card ID or Member ID
  async lookupCard(identifier: string): Promise<ApiResponse<CardLookupResponse>> {
    await new Promise((r) => setTimeout(r, 550));

    const clean = identifier.trim().toUpperCase();
    if (!clean) {
      return {
        success: false,
        message: 'Please enter your Physical Card ID or Member ID.',
        data: {
          status: 'CARD_NOT_FOUND',
          message: 'Please provide a valid card identifier.'
        }
      };
    }

    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);

    // Find card by cardId or assignedMemberId
    const card = cards.find((c) => 
      c.cardId.toUpperCase() === clean || 
      (c.assignedMemberId && c.assignedMemberId.toUpperCase() === clean)
    );

    // Find associated member
    const member = members.find((m) => 
      m.memberId.toUpperCase() === clean || 
      (m.assignedCardId && m.assignedCardId.toUpperCase() === clean) ||
      (card && (m.memberId.toUpperCase() === (card.assignedMemberId || card.cardId).toUpperCase()))
    );

    // 1. Check if card exists
    if (!card && !member) {
      return {
        success: false,
        message: "We couldn't find this card or member in our records. Please verify the ID on your plastic card.",
        data: {
          status: 'CARD_NOT_FOUND',
          message: "We couldn't find this card. Check the ID and try again."
        }
      };
    }

    // 2. Check if card is blocked
    if (card && (card.status === 'BLOCKED' || card.status === 'LOST' || card.status === 'lost')) {
      return {
        success: false,
        message: 'This card is currently blocked or reported lost. Please contact the cooperative Secretariat.',
        data: {
          status: 'CARD_BLOCKED',
          message: 'This card is currently blocked. Please contact the cooperative.',
          card
        }
      };
    }

    // 3. Check if membership is suspended or terminated
    if (member && (member.membershipStatus === 'SUSPENDED' || member.membershipStatus === 'TERMINATED')) {
      return {
        success: false,
        message: 'This cooperative membership is not currently eligible for digital activation.',
        data: {
          status: 'MEMBERSHIP_NOT_APPROVED',
          message: 'This membership is not currently eligible for activation.'
        }
      };
    }

    // 4. Check if already activated
    const isCardActivated = card ? (card.status === 'ACTIVATED' || card.status === 'active') : false;
    const isDigitalActive = member ? member.digitalAccountStatus === 'ACTIVE' : false;

    if (isCardActivated && isDigitalActive) {
      return {
        success: false,
        message: 'This membership is already activated. Please sign in to access your member dashboard.',
        data: {
          status: 'ALREADY_ACTIVATED',
          message: 'This membership is already activated. Please sign in.',
          card: card || undefined,
          membership: member || undefined
        }
      };
    }

    // 5. Eligible for Activation
    const resolvedMemberName = member?.fullName || card?.assignedMemberName || 'Valued Member';
    const resolvedPhone = member?.phone || card?.assignedPhone || '+234 802 334 1122';
    const resolvedEmail = member?.email || card?.assignedEmail || 'member@mosunmolacoop.ng';
    const resolvedMemberId = member?.memberId || card?.assignedMemberId || clean;
    const resolvedCardId = card?.cardId || clean;

    return {
      success: true,
      message: `Card found! Allocated to ${resolvedMemberName}.`,
      data: {
        status: 'FOUND_ELIGIBLE',
        message: 'Physical card verified and ready for digital activation.',
        card: card || undefined,
        membership: member || undefined,
        prefill: {
          fullName: resolvedMemberName,
          memberId: resolvedMemberId,
          cardId: resolvedCardId,
          maskedPhone: maskPhone(resolvedPhone),
          maskedEmail: maskEmail(resolvedEmail),
          phone: resolvedPhone,
          email: resolvedEmail,
          branch: card?.branch || 'Ikeja Central Secretariat',
          joinDate: member?.joinDate || card?.issuedDate || '2026-02-01',
          occupation: member?.occupation,
          address: member?.address
        }
      }
    };
  },

  // Step 4: Complete Digital Activation via OTP
  async activateCard(payload: {
    cardId: string;
    memberId: string;
    password?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    address?: string;
    occupation?: string;
    nextOfKin?: { name: string; phone: string; relationship: string; address?: string };
  }): Promise<ApiResponse<MemberProfile>> {
    await new Promise((r) => setTimeout(r, 650));

    const cleanCardId = payload.cardId.trim().toUpperCase();
    const cleanMemberId = payload.memberId.trim().toUpperCase();

    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);

    // Update physical card status to ACTIVATED
    const updatedCards = cards.map((c) => {
      if (c.cardId.toUpperCase() === cleanCardId || (c.assignedMemberId && c.assignedMemberId.toUpperCase() === cleanMemberId)) {
        return {
          ...c,
          status: 'ACTIVATED' as const,
          activationDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    });
    saveToStorage(CARDS_STORAGE_KEY, updatedCards);

    // Update or create member profile with ACTIVE digital account
    let targetMember = members.find((m) => 
      m.memberId.toUpperCase() === cleanMemberId || 
      (m.assignedCardId && m.assignedCardId.toUpperCase() === cleanCardId)
    );

    if (targetMember) {
      targetMember = {
        ...targetMember,
        membershipStatus: 'ACTIVE',
        digitalAccountStatus: 'ACTIVE',
        physicalCardStatus: 'ACTIVATED',
        status: 'active',
        email: payload.email || targetMember.email,
        phone: payload.phone || targetMember.phone,
        avatar: payload.avatarUrl || targetMember.avatar,
        address: payload.address || targetMember.address,
        occupation: payload.occupation || targetMember.occupation,
        nextOfKin: payload.nextOfKin ? {
          ...targetMember.nextOfKin,
          ...payload.nextOfKin,
          address: payload.nextOfKin.address || targetMember.address
        } : targetMember.nextOfKin
      };

      const updatedMembers = members.map((m) => m.id === targetMember!.id ? targetMember! : m);
      saveToStorage(MEMBERS_STORAGE_KEY, updatedMembers);
      saveToStorage(AUTH_MEMBER_KEY, targetMember.id);
    } else {
      // Fallback: create fresh active member profile
      const newMember: MemberProfile = {
        id: `MEM-${cleanMemberId.slice(-4)}`,
        memberId: cleanMemberId,
        fullName: 'Activated Member',
        email: payload.email || 'member@mosunmolacoop.ng',
        phone: payload.phone || '+234 800 000 0000',
        avatar: payload.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        joinDate: new Date().toISOString().split('T')[0],
        membershipStatus: 'ACTIVE',
        digitalAccountStatus: 'ACTIVE',
        physicalCardStatus: 'ACTIVATED',
        assignedCardId: cleanCardId,
        status: 'active',
        kycVerified: true,
        kycDocuments: {
          idType: 'NIN',
          idNumber: '29810482910',
          fileUrl: '',
          status: 'verified',
          submittedAt: new Date().toISOString()
        },
        nextOfKin: payload.nextOfKin ? {
          name: payload.nextOfKin.name,
          phone: payload.nextOfKin.phone,
          relationship: payload.nextOfKin.relationship,
          address: payload.nextOfKin.address || 'Same as member'
        } : {
          name: 'Next of Kin',
          relationship: 'Spouse',
          phone: payload.phone || '+234 800 000 0000',
          address: payload.address || 'Lagos, Nigeria'
        },
        bankDetails: {
          bankName: 'Access Bank PLC',
          accountNumber: '0129482710',
          accountName: 'ACTIVATED COOPERATIVE MEMBER'
        },
        qrToken: `MOSUNMOLA-QR-${cleanMemberId}-ACTIVATED`,
        address: payload.address || 'Lagos, Nigeria',
        occupation: payload.occupation || 'Cooperative Member'
      };

      saveToStorage(MEMBERS_STORAGE_KEY, [newMember, ...members]);
      saveToStorage(AUTH_MEMBER_KEY, newMember.id);
      targetMember = newMember;
    }

    await adminService.logAction(
      'System Security',
      'pa_officer',
      'DIGITAL_ACCOUNT_ACTIVATION',
      `Member ${targetMember.fullName} (${cleanMemberId}) completed OTP activation for card ${cleanCardId}.`
    );

    return {
      success: true,
      message: `Card ${cleanCardId} activated successfully! Welcome to your digital member command center.`,
      data: targetMember
    };
  },

  // Admin: Issue New Physical Card
  async issueCard(
    memberId: string, 
    cardId: string, 
    cardType: PhysicalMemberCard['cardType'] = 'standard_plastic', 
    branch: string = 'Ikeja Central Secretariat',
    adminName: string = 'Super Admin'
  ): Promise<ApiResponse<PhysicalMemberCard>> {
    await new Promise((r) => setTimeout(r, 400));

    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);

    const member = members.find((m) => m.memberId.toUpperCase() === memberId.toUpperCase());
    const memberName = member ? member.fullName : 'Issued Member';

    const newCard: PhysicalMemberCard = {
      cardId: cardId.trim().toUpperCase(),
      assignedMemberId: memberId.trim().toUpperCase(),
      assignedMemberName: memberName,
      assignedEmail: member?.email,
      assignedPhone: member?.phone,
      cardType,
      batchNumber: `BATCH-2026-${new Date().toISOString().slice(5, 7)}-${branch.slice(0, 3).toUpperCase()}`,
      status: 'ISSUED',
      issuedDate: new Date().toISOString().split('T')[0],
      pickupSlipCode: `SLIP-${cardId.slice(-4)}-${branch.slice(0, 3).toUpperCase()}`,
      securityHash: `sha256-mos-${cardId}-token`,
      branch
    };

    saveToStorage(CARDS_STORAGE_KEY, [newCard, ...cards]);

    // Update member's card reference
    if (member) {
      member.assignedCardId = newCard.cardId;
      member.physicalCardStatus = 'ISSUED';
      saveToStorage(MEMBERS_STORAGE_KEY, members);
    }

    await adminService.logAction(
      adminName,
      'master_admin',
      'ISSUE_PHYSICAL_CARD',
      `Issued physical card ${newCard.cardId} to member ${memberId} (${memberName})`
    );

    return {
      success: true,
      message: `Physical Card ${newCard.cardId} issued to ${memberName}.`,
      data: newCard
    };
  },

  // Admin: Block / Deactivate Physical Card
  async blockCard(cardId: string, reason: string, adminName: string = 'Super Admin'): Promise<ApiResponse<PhysicalMemberCard>> {
    await new Promise((r) => setTimeout(r, 350));

    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const card = cards.find((c) => c.cardId.toUpperCase() === cardId.toUpperCase());

    if (!card) throw new Error('Card not found');

    card.status = 'BLOCKED';
    saveToStorage(CARDS_STORAGE_KEY, cards);

    await adminService.logAction(
      adminName,
      'master_admin',
      'BLOCK_PHYSICAL_CARD',
      `Card ${cardId} blocked. Reason: ${reason}`
    );

    return {
      success: true,
      message: `Card ${cardId} has been blocked.`,
      data: card
    };
  }
};
