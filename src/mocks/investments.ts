import type { InvestmentAsset, MemberInvestment } from '../types';

export const initialInvestmentAssets: InvestmentAsset[] = [
  {
    id: 'ASSET-RE-01',
    title: 'Mosunmola Apex Real Estate Scheme (Ibeju-Lekki Phase 2)',
    category: 'real_estate',
    location: 'Coastal Road Corridor, Ibeju-Lekki, Lagos',
    unitPrice: 1500000,
    totalUnits: 120,
    availableUnits: 34,
    annualYieldPercent: 24.5,
    durationMonths: 18,
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    description: 'Cooperative land banking initiative in the fast-appreciating Dangote Refinery & Free Trade Zone corridor. Certified Gazette title with global survey.',
    features: ['Direct Allocation with C of O in view', 'Paved access road & perimeter fencing', 'High capital appreciation (>25% per annum)', 'Instant deed of cooperative assignment']
  },
  {
    id: 'ASSET-AG-02',
    title: 'Mosunmola Commercial Cassava & Palm Oil Mill Facility',
    category: 'agro_processing',
    location: 'Kobape Industrial Corridor, Ogun State',
    unitPrice: 250000,
    totalUnits: 500,
    availableUnits: 88,
    annualYieldPercent: 21.0,
    durationMonths: 12,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    description: 'High-capacity automated agro-processing plant producing export-grade garri and palm oil. Guaranteed off-take agreement with FMCG conglomerates.',
    features: ['Quarterly dividend profit distribution', 'Fully insured by Leadway Assurance', 'Off-take contracts signed with food processors', 'Site inspection tours every Saturday']
  },
  {
    id: 'ASSET-TH-03',
    title: 'Premium High-Yield Member Thrift Trust',
    category: 'thrift_pool',
    location: 'Mosunmola Treasury Secured Vault, Lagos',
    unitPrice: 100000,
    totalUnits: 1000,
    availableUnits: 215,
    annualYieldPercent: 19.5,
    durationMonths: 12,
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    description: 'Guaranteed fixed-income pooled thrift invested exclusively in low-risk Federal Government Treasury Bills and vetted member commercial paper.',
    features: ['Zero market volatility', 'Compound interest reinvestment option', 'Early liquidation permissible with 7 days notice', 'Backed by cooperative reserve fund']
  }
];

export const initialMemberInvestments: MemberInvestment[] = [
  {
    id: 'INV-2025-019',
    memberId: 'MCS-2026-8942',
    assetId: 'ASSET-RE-01',
    assetTitle: 'Mosunmola Apex Real Estate Scheme (Ibeju-Lekki Phase 2)',
    units: 2,
    totalInvested: 3000000,
    purchaseDate: '2025-04-10',
    maturityDate: '2026-10-10',
    projectedPayout: 3735000,
    certificateNumber: 'MCS-CERT-RE-08942-01',
    status: 'active'
  },
  {
    id: 'INV-2025-044',
    memberId: 'MCS-2026-8942',
    assetId: 'ASSET-AG-02',
    assetTitle: 'Mosunmola Commercial Cassava & Palm Oil Mill Facility',
    units: 4,
    totalInvested: 1000000,
    purchaseDate: '2025-07-01',
    maturityDate: '2026-07-01',
    projectedPayout: 1210000,
    certificateNumber: 'MCS-CERT-AG-08942-02',
    status: 'active'
  }
];
