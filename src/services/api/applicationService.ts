import type { 
  ApiResponse, 
  CreateMembershipApplicationPayload, 
  MemberProfile, 
  MembershipApplication, 
  PhysicalMemberCard 
} from '../../types';
import { initialMembershipApplications } from '../../mocks/applications';
import { initialMembersRegistry } from '../../mocks/members';
import { initialPhysicalCards } from '../../mocks/cards';
import { getFromStorage, saveToStorage } from './storageHelper';
import { adminService } from './adminService';

const APPLICATIONS_STORAGE_KEY = 'membership_applications';
const MEMBERS_STORAGE_KEY = 'members_registry';
const CARDS_STORAGE_KEY = 'physical_cards';

export const applicationService = {
  // Public Applicant: Submit Membership Application
  async submitApplication(payload: CreateMembershipApplicationPayload): Promise<ApiResponse<MembershipApplication>> {
    await new Promise((r) => setTimeout(r, 600));

    const apps = getFromStorage<MembershipApplication[]>(APPLICATIONS_STORAGE_KEY, initialMembershipApplications);

    // Format new canonical Application ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const appId = `APP-2026-${randomSuffix}`;

    const newApp: MembershipApplication = {
      id: appId,
      fullName: payload.fullName.trim(),
      dateOfBirth: payload.dateOfBirth,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      address: payload.address.trim(),
      state: payload.state || 'Lagos',
      lga: payload.lga || 'Ikeja',
      occupation: payload.occupation.trim(),
      intendedMonthlySavings: payload.intendedMonthlySavings || payload.monthlyThriftTarget || 50000,
      monthlyThriftTarget: payload.monthlyThriftTarget || payload.intendedMonthlySavings || 50000,
      savingsPlanId: payload.savingsPlanId || 'standard',
      idType: payload.idType,
      idNumber: payload.idNumber.trim(),
      idDocumentStatus: payload.idDocumentStatus || 'PROVIDED',
      idDocumentUrl: payload.idDocumentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      reasonForJoining: payload.reasonForJoining || 'Target thrift savings and eligibility for 5% cooperative business credit.',
      nextOfKin: payload.nextOfKin || {
        name: payload.nextOfKinName || '',
        phone: payload.nextOfKinPhone || '',
        relationship: payload.nextOfKinRelationship || 'Next of Kin',
        address: payload.address || ''
      },
      nextOfKinName: payload.nextOfKinName || (payload.nextOfKin ? payload.nextOfKin.name : ''),
      nextOfKinPhone: payload.nextOfKinPhone || (payload.nextOfKin ? payload.nextOfKin.phone : ''),
      nextOfKinRelationship: payload.nextOfKinRelationship || (payload.nextOfKin ? payload.nextOfKin.relationship : 'Next of Kin'),
      status: 'SUBMITTED', // NOT approved yet!
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    saveToStorage(APPLICATIONS_STORAGE_KEY, [newApp, ...apps]);

    return {
      success: true,
      message: `Your membership application has been received and logged under reference ${newApp.id}.`,
      data: newApp
    };
  },

  // Public Applicant: Track Application Status by ID, Email, or Phone
  async trackApplication(query: string): Promise<ApiResponse<MembershipApplication | null>> {
    await new Promise((r) => setTimeout(r, 450));

    const clean = query.trim().toLowerCase();
    if (!clean) {
      return {
        success: false,
        message: 'Please enter your Application Reference ID (e.g. APP-2026-00482) or registered email.',
        data: null
      };
    }

    const apps = getFromStorage<MembershipApplication[]>(APPLICATIONS_STORAGE_KEY, initialMembershipApplications);

    const app = apps.find((a) => 
      a.id.toLowerCase() === clean || 
      a.email.toLowerCase() === clean || 
      a.phone.replace(/[\s\-\+]/g, '').includes(clean.replace(/[\s\-\+]/g, ''))
    );

    if (!app) {
      return {
        success: false,
        message: `No membership application found matching "${query}". Please check the ID or contact the Secretariat.`,
        data: null
      };
    }

    return {
      success: true,
      message: `Application ${app.id} retrieved successfully.`,
      data: app
    };
  },

  // Admin Queue: List Applications
  async getApplications(statusFilter?: string): Promise<ApiResponse<MembershipApplication[]>> {
    await new Promise((r) => setTimeout(r, 300));
    const apps = getFromStorage<MembershipApplication[]>(APPLICATIONS_STORAGE_KEY, initialMembershipApplications);

    let filtered = apps;
    if (statusFilter && statusFilter !== 'ALL') {
      filtered = apps.filter((a) => a.status.toUpperCase() === statusFilter.toUpperCase());
    }

    return {
      success: true,
      message: 'Applications retrieved.',
      data: filtered
    };
  },

  // Admin Queue: Get Application Detail
  async getApplicationById(id: string): Promise<ApiResponse<MembershipApplication | null>> {
    await new Promise((r) => setTimeout(r, 200));
    const apps = getFromStorage<MembershipApplication[]>(APPLICATIONS_STORAGE_KEY, initialMembershipApplications);
    const app = apps.find((a) => a.id === id);
    return {
      success: !!app,
      message: app ? 'Application details found.' : 'Application not found.',
      data: app || null
    };
  },

  // Admin Action: Approve Application → Create Membership → Issue Card
  async approveApplication(
    appId: string, 
    customCardId?: string, 
    adminName: string = 'Super Admin'
  ): Promise<ApiResponse<{ application: MembershipApplication; membership: MemberProfile; card: PhysicalMemberCard }>> {
    await new Promise((r) => setTimeout(r, 600));

    const apps = getFromStorage<MembershipApplication[]>(APPLICATIONS_STORAGE_KEY, initialMembershipApplications);
    const app = apps.find((a) => a.id === appId);

    if (!app) {
      throw new Error(`Application ${appId} not found.`);
    }

    // Generate canonical Member ID (The cooperative system generates this; applicant cannot choose)
    const canonicalMemberId = `MCS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Assigned physical card ID can be canonical Member ID or specified custom RFID card
    const assignedCardId = customCardId && customCardId.trim() 
      ? customCardId.trim().toUpperCase() 
      : canonicalMemberId;

    // 1. Update Application status
    app.status = 'APPROVED';
    app.approvedMemberId = canonicalMemberId;
    app.assignedCardId = assignedCardId;
    app.reviewedBy = adminName;
    app.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    saveToStorage(APPLICATIONS_STORAGE_KEY, apps);

    // 2. Create Official Cooperative Membership in members registry
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);
    const newMemberProfile: MemberProfile = {
      id: `MEM-${canonicalMemberId.slice(-4)}`,
      memberId: canonicalMemberId,
      applicationId: app.id,
      fullName: app.fullName,
      dateOfBirth: app.dateOfBirth || '1985-01-01',
      email: app.email,
      phone: app.phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      joinDate: new Date().toISOString().split('T')[0],
      membershipStatus: 'ACTIVE',
      digitalAccountStatus: 'NOT_ACTIVATED', // NOT activated yet until card verification & OTP!
      physicalCardStatus: 'ISSUED',
      assignedCardId: assignedCardId,
      status: 'active',
      kycVerified: true,
      kycDocuments: {
        idType: app.idType,
        idNumber: app.idNumber,
        fileUrl: app.idDocumentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        status: 'verified',
        submittedAt: app.submittedAt
      },
      nextOfKin: {
        name: app.nextOfKin?.name || app.nextOfKinName || 'Next of Kin',
        phone: app.nextOfKin?.phone || app.nextOfKinPhone || app.phone,
        relationship: app.nextOfKin?.relationship || app.nextOfKinRelationship || 'Relative',
        address: app.nextOfKin?.address || app.address || ''
      },
      bankDetails: {
        bankName: 'Access Bank PLC',
        accountNumber: '0129482710',
        accountName: app.fullName.toUpperCase()
      },
      qrToken: `MOSUNMOLA-AUTH-PASS-${canonicalMemberId}-${Date.now()}`,
      address: app.address,
      state: app.state,
      lga: app.lga,
      occupation: app.occupation
    };

    saveToStorage(MEMBERS_STORAGE_KEY, [newMemberProfile, ...members]);

    // 3. Issue Physical Card in cards registry
    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const existingCard = cards.find((c) => c.cardId.toUpperCase() === assignedCardId.toUpperCase());

    const issuedCard: PhysicalMemberCard = existingCard ? {
      ...existingCard,
      assignedMemberId: canonicalMemberId,
      assignedMemberName: app.fullName,
      assignedEmail: app.email,
      assignedPhone: app.phone,
      status: 'ISSUED'
    } : {
      cardId: assignedCardId,
      assignedMemberId: canonicalMemberId,
      assignedMemberName: app.fullName,
      assignedEmail: app.email,
      assignedPhone: app.phone,
      cardType: app.intendedMonthlySavings >= 100000 ? 'rfid_executive' : 'standard_plastic',
      batchNumber: 'BATCH-2026-Q3-APPROVED',
      status: 'ISSUED',
      issuedDate: new Date().toISOString().split('T')[0],
      pickupSlipCode: `SLIP-${canonicalMemberId.slice(-4)}-${app.lga.slice(0, 3).toUpperCase()}`,
      securityHash: `sha256-mos-${canonicalMemberId}-hash`,
      branch: `${app.lga || 'Ikeja'} Cooperative Branch`
    };

    const updatedCards = existingCard 
      ? cards.map((c) => c.cardId.toUpperCase() === assignedCardId.toUpperCase() ? issuedCard : c)
      : [issuedCard, ...cards];

    saveToStorage(CARDS_STORAGE_KEY, updatedCards);

    // 4. Log Audit Action
    await adminService.logAction(
      adminName,
      'master_admin',
      'APPROVE_MEMBERSHIP_APPLICATION',
      `Approved application ${app.id} for ${app.fullName}. Created Member ID: ${canonicalMemberId}, Physical Card: ${assignedCardId}`
    );

    return {
      success: true,
      message: `Application ${app.id} approved! Canonical Member ID ${canonicalMemberId} generated and Physical Card ${assignedCardId} issued.`,
      data: {
        application: app,
        membership: newMemberProfile,
        card: issuedCard
      }
    };
  },

  // Admin Action: Reject Application
  async rejectApplication(appId: string, reason: string, adminName: string = 'Super Admin'): Promise<ApiResponse<MembershipApplication>> {
    await new Promise((r) => setTimeout(r, 400));
    const apps = getFromStorage<MembershipApplication[]>(APPLICATIONS_STORAGE_KEY, initialMembershipApplications);
    const app = apps.find((a) => a.id === appId);

    if (!app) throw new Error('Application not found');

    app.status = 'REJECTED';
    app.rejectionReason = reason;
    app.reviewedBy = adminName;
    app.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    saveToStorage(APPLICATIONS_STORAGE_KEY, apps);

    await adminService.logAction(
      adminName,
      'master_admin',
      'REJECT_MEMBERSHIP_APPLICATION',
      `Rejected application ${app.id} for ${app.fullName}. Reason: ${reason}`
    );

    return {
      success: true,
      message: `Application ${app.id} has been rejected.`,
      data: app
    };
  },

  // Admin Action: Request More Information
  async requestMoreInfo(appId: string, notes: string, adminName: string = 'Super Admin'): Promise<ApiResponse<MembershipApplication>> {
    await new Promise((r) => setTimeout(r, 400));
    const apps = getFromStorage<MembershipApplication[]>(APPLICATIONS_STORAGE_KEY, initialMembershipApplications);
    const app = apps.find((a) => a.id === appId);

    if (!app) throw new Error('Application not found');

    app.status = 'MORE_INFORMATION_REQUIRED';
    app.adminNotes = notes;
    app.reviewedBy = adminName;
    app.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    saveToStorage(APPLICATIONS_STORAGE_KEY, apps);

    await adminService.logAction(
      adminName,
      'master_admin',
      'REQUEST_MORE_APPLICATION_INFO',
      `Requested additional information for application ${app.id}. Notes: ${notes}`
    );

    return {
      success: true,
      message: `Applicant requested for additional information on ${app.id}.`,
      data: app
    };
  }
};
