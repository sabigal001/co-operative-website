// Currency and Amount in Words Formatter for Mosunmola Cooperative Multipurpose Society

export function formatNaira(amount: number, showKobo: boolean = true): string {
  if (isNaN(amount)) return '₦0.00';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: showKobo ? 2 : 0,
    maximumFractionDigits: showKobo ? 2 : 0
  }).format(amount);
}

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertThreeDigits(num: number): string {
  let str = '';
  if (num >= 100) {
    str += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 20) {
    str += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  if (num > 0) {
    str += ones[num] + ' ';
  }
  return str.trim();
}

export function numberToWordsNaira(amount: number): string {
  if (amount === 0) return 'Zero Naira Only';
  if (amount < 0) return 'Negative ' + numberToWordsNaira(Math.abs(amount));

  const integerPart = Math.floor(amount);
  const koboPart = Math.round((amount - integerPart) * 100);

  let num = integerPart;
  const parts: string[] = [];

  const billions = Math.floor(num / 1_000_000_000);
  if (billions > 0) {
    parts.push(convertThreeDigits(billions) + ' Billion');
    num %= 1_000_000_000;
  }

  const millions = Math.floor(num / 1_000_000);
  if (millions > 0) {
    parts.push(convertThreeDigits(millions) + ' Million');
    num %= 1_000_000;
  }

  const thousands = Math.floor(num / 1_000);
  if (thousands > 0) {
    parts.push(convertThreeDigits(thousands) + ' Thousand');
    num %= 1_000;
  }

  if (num > 0) {
    parts.push(convertThreeDigits(num));
  }

  let words = parts.join(', ') + ' Naira';

  if (koboPart > 0) {
    words += ' and ' + convertThreeDigits(koboPart) + ' Kobo';
  }

  return words.trim() + ' Only';
}

export const CATEGORY_LABELS: Record<string, string> = {
  MONTHLY_THRIFT: 'Monthly Thrift (Ajo)',
  VOLUNTARY_SAVINGS: 'Voluntary Savings',
  TARGET_SAVINGS: 'Target Savings',
  SHARE_CAPITAL: 'Share Capital Subscription',
  LOAN_REPAYMENT: 'Loan Installment Repayment',
  REGISTRATION_FEE: 'Membership Registration & Passbook',
  DEVELOPMENT_LEVY: 'Annual Development Levy'
};

export const METHOD_LABELS: Record<string, string> = {
  CASH_AT_DESK: 'Cash at Secretariat Desk',
  BANK_TRANSFER: 'Direct Bank Transfer',
  BANK_TELLER: 'Bank Deposit Teller Slip',
  POS_TERMINAL: 'Secretariat POS Terminal'
};
