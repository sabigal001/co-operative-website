import type { MemberProfile } from '../types';

export const primaryDemoMember: MemberProfile = {
  id: 'MEM-8942',
  memberId: 'MCS-2026-8942',
  applicationId: 'APP-2023-00012',
  fullName: 'Chief Adeleke Balogun',
  dateOfBirth: '1970-04-18',
  email: 'adeleke.balogun@mosunmolacoop.ng',
  phone: '+234 803 456 7890',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  joinDate: '2023-04-12',
  membershipStatus: 'ACTIVE',
  digitalAccountStatus: 'ACTIVE',
  physicalCardStatus: 'ACTIVATED',
  assignedCardId: 'MCS-2026-8942',
  status: 'active',
  kycVerified: true,
  kycDocuments: {
    idType: 'NIN',
    idNumber: '29810482910',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    status: 'verified',
    submittedAt: '2026-01-16'
  },
  nextOfKin: {
    name: 'Mrs. Olufunke Balogun',
    relationship: 'Spouse',
    phone: '+234 802 889 0011',
    address: 'Plot 14, Admiralty Way, Lekki Phase 1, Lagos'
  },
  bankDetails: {
    bankName: 'Access Bank PLC',
    accountNumber: '0129482710',
    accountName: 'ADELEKE BABATUNDE BALOGUN'
  },
  qrToken: 'MOSUNMOLA-QR-MCS-2026-8942-VERIFIED-AUTH-TOKEN-90812',
  address: '14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
  state: 'Lagos',
  lga: 'Eti-Osa',
  occupation: 'Managing Director / Agro-Tech Consultant'
};

export const initialMembersRegistry: MemberProfile[] = [
  primaryDemoMember,
  {
    id: 'MEM-9921',
    memberId: 'MCS-2026-9921',
    applicationId: 'APP-2024-00109',
    fullName: 'Dr. Babatunde Alabi',
    dateOfBirth: '1975-08-11',
    email: 'babatunde.alabi@unilag.edu.ng',
    phone: '+234 809 112 3344',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    joinDate: '2024-01-10',
    membershipStatus: 'ACTIVE',
    digitalAccountStatus: 'ACTIVE',
    physicalCardStatus: 'ACTIVATED',
    assignedCardId: 'MCS-2026-9921',
    status: 'active',
    kycVerified: true,
    kycDocuments: {
      idType: 'International Passport',
      idNumber: 'A08291048',
      fileUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
      status: 'verified',
      submittedAt: '2026-01-21'
    },
    nextOfKin: {
      name: 'Dr. (Mrs) Kemi Alabi',
      relationship: 'Spouse',
      phone: '+234 803 999 1234',
      address: 'Senior Staff Quarters, UNILAG, Akoka, Lagos'
    },
    bankDetails: {
      bankName: 'Guaranty Trust Bank (GTB)',
      accountNumber: '0223948192',
      accountName: 'BABATUNDE ADISA ALABI'
    },
    qrToken: 'MOSUNMOLA-QR-MCS-2026-9921-VERIFIED-AUTH-TOKEN-11029',
    address: 'Senior Staff Quarters, UNILAG, Akoka, Lagos',
    state: 'Lagos',
    lga: 'Mainland',
    occupation: 'Professor of Biochemistry'
  },
  {
    id: 'MEM-1033',
    memberId: 'MCS-2026-1033',
    applicationId: 'APP-2026-00301',
    fullName: 'Hajiya Fatima Garba',
    dateOfBirth: '1988-02-14',
    email: 'fatima.garba@gmail.com',
    phone: '+234 802 334 1122',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    joinDate: '2026-02-01',
    membershipStatus: 'ACTIVE',
    digitalAccountStatus: 'NOT_ACTIVATED', // Approved member, physical card issued, pending digital activation!
    physicalCardStatus: 'ISSUED',
    assignedCardId: 'MCS-2026-1033',
    status: 'pending_kyc',
    kycVerified: true,
    kycDocuments: {
      idType: 'NIN',
      idNumber: '39201948291',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      status: 'verified',
      submittedAt: '2026-02-02'
    },
    nextOfKin: {
      name: 'Ibrahim Garba',
      relationship: 'Brother',
      phone: '+234 806 123 4567',
      address: '24 Saka Tinubu, Victoria Island, Lagos'
    },
    bankDetails: {
      bankName: 'Zenith Bank',
      accountNumber: '2019283746',
      accountName: 'FATIMA BINTA GARBA'
    },
    qrToken: 'MOSUNMOLA-QR-MCS-2026-1033-PENDING-KYC-TOKEN-39201',
    address: 'Victoria Island, Lagos',
    state: 'Lagos',
    lga: 'Eti-Osa',
    occupation: 'Commodity Trading Specialist'
  },
  {
    id: 'MEM-5571',
    memberId: 'MCS-2026-5571',
    applicationId: 'APP-2026-00479',
    fullName: 'Engr. Emeka Okafor',
    dateOfBirth: '1985-03-19',
    email: 'emeka.okafor@techpulse.ng',
    phone: '+234 805 778 9900',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    joinDate: '2026-02-05',
    membershipStatus: 'ACTIVE',
    digitalAccountStatus: 'NOT_ACTIVATED', // Physical card issued, unactivated digitally!
    physicalCardStatus: 'ISSUED',
    assignedCardId: 'MCS-2026-5571',
    status: 'pending_kyc',
    kycVerified: true,
    kycDocuments: {
      idType: 'INEC Voter\'s Card',
      idNumber: '90F1B28394819',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      status: 'verified',
      submittedAt: '2026-02-06'
    },
    nextOfKin: {
      name: 'Ngozi Okafor',
      relationship: 'Sister',
      phone: '+234 807 443 2211',
      address: 'Chevy View Estate, Chevron Tollgate, Lekki'
    },
    bankDetails: {
      bankName: 'First Bank of Nigeria',
      accountNumber: '3049182746',
      accountName: 'EMEKA CHUKWUDI OKAFOR'
    },
    qrToken: 'MOSUNMOLA-QR-MCS-2026-5571-PENDING-KYC-TOKEN-55829',
    address: 'Chevy View Estate, Lekki, Lagos',
    state: 'Lagos',
    lga: 'Eti-Osa',
    occupation: 'Senior Infrastructure Engineer'
  }
];
