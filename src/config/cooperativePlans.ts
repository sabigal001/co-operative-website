import type { SavingsPlanConfig, LoanProductConfig } from '../types';

export const COOPERATIVE_SAVINGS_PLANS: SavingsPlanConfig[] = [
  {
    id: 'basic_thrift',
    name: 'Basic Thrift Plan',
    tier: 'Basic Tier',
    monthlyAmount: 20000,
    description: 'Disciplined monthly contribution suitable for artisans, micro-retailers, and apprentice savers.',
    targetAudience: 'Micro-enterprises, entry-level professionals, apprentices',
    recommendedDuration: 'Minimum 12 continuous months',
    benefits: [
      'Statutory 18.5% annual AGM dividend distribution',
      'Eligible for 5.0% flat interest micro-loans after 6 months',
      'Instant digital passbook & automated receipting'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Membership Plan',
    tier: 'Core Tier',
    monthlyAmount: 50000,
    description: 'The standard cooperative thrift target for business owners, civil servants, and established entrepreneurs.',
    targetAudience: 'SME operators, civil servants, corporate professionals',
    recommendedDuration: 'Continuous annual cycle',
    benefits: [
      'Priority access to working capital credit up to 3× total savings',
      'Quarterly financial statements & dividend accruals',
      'Exclusive co-ownership slots in cooperative agro-processing ventures'
    ]
  },
  {
    id: 'executive',
    name: 'Executive Thrift Plan',
    tier: 'Executive Tier',
    monthlyAmount: 100000,
    description: 'Higher-yield savings portfolio designed for business directors, consultants, and senior executives.',
    targetAudience: 'Senior executives, established merchants, legal & medical practitioners',
    recommendedDuration: '24 to 36 months wealth accumulation',
    benefits: [
      'Credit line qualification up to ₦10,000,000 at 5% rate',
      'Dedicated relationship officer & priority physical card dispatch',
      'First-tranche allocation on prime Lagos commercial land banking'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Wealth Thrift',
    tier: 'Premium Tier',
    monthlyAmount: 250000,
    description: 'Accelerated asset acquisition vehicle for high-net-worth members and institutional partners.',
    targetAudience: 'High-volume distributors, import-export operators, tech executives',
    recommendedDuration: 'Long-term equity & real asset vesting',
    benefits: [
      'VIP trustee advisory & board observer privileges at AGM',
      'Direct co-ownership certificates for commercial warehouse facilities',
      'Expedited loan disbursement within 24 hours of committee sign-off'
    ]
  },
  {
    id: 'institutional',
    name: 'Institutional / Corporate Plan',
    tier: 'Institutional Tier',
    monthlyAmount: 50000,
    description: 'Tailored for corporate staff cooperatives, family trusts, and large trade syndicates.',
    targetAudience: 'Family trusts, corporate syndicates, religious and trade bodies',
    recommendedDuration: 'Multi-year institutional covenant',
    benefits: [
      'Multi-signatory disbursement & custom audit reports',
      'Maximum dividend payout tier with capital appreciation hedge',
      'Special syndicated commercial credit facilities'
    ]
  }
];

export const COOPERATIVE_LOAN_PRODUCTS: LoanProductConfig[] = [
  {
    id: 'prod_micro_credit',
    name: 'Regular Member Micro-Credit',
    code: 'LN-MIC',
    interestRatePercent: 5.0,
    maxMultiplierOfSavings: 3.0,
    maxAmount: 2500000,
    minSavingsDurationMonths: 6,
    maxTenureMonths: 12,
    processingFeePercent: 1.0,
    repaymentFrequency: 'monthly',
    description: 'Standard working capital facility for inventory restocking and urgent trade liquidity.',
    eligibilitySummary: 'Active member for at least 6 months with up-to-date monthly thrift contributions.'
  },
  {
    id: 'prod_agro_processing',
    name: 'Agro-Processing & Asset Loan',
    code: 'LN-AGR',
    interestRatePercent: 5.0,
    maxMultiplierOfSavings: 3.5,
    maxAmount: 5000000,
    minSavingsDurationMonths: 9,
    maxTenureMonths: 24,
    processingFeePercent: 1.5,
    repaymentFrequency: 'monthly',
    description: 'Equipment procurement, grain storage storage, and agro-commodity processing finance.',
    eligibilitySummary: 'Registered agribusiness venture with two active cooperative member guarantors.'
  },
  {
    id: 'prod_executive_sme',
    name: 'Executive SME Expansion Credit',
    code: 'LN-SME',
    interestRatePercent: 4.5,
    maxMultiplierOfSavings: 4.0,
    maxAmount: 10000000,
    minSavingsDurationMonths: 12,
    maxTenureMonths: 36,
    processingFeePercent: 1.0,
    repaymentFrequency: 'monthly',
    description: 'Large-scale commercial enterprise development and infrastructural co-financing.',
    eligibilitySummary: 'Executive/Premium member with verified bank statements and trustee board vetting.'
  }
];
