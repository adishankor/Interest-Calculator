// ==========================================
// FINANCIAL CALCULATION ENGINE — DepositIQ
// ==========================================

// Format currency with commas
export const formatCurrency = (amount, currency = '৳') => {
  if (isNaN(amount) || amount === null) return `${currency}0.00`;
  return `${currency}${Math.abs(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatNumber = (n) =>
  Number(n)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ==========================================
// 1. DPS CALCULATOR
// Monthly deposit scheme
// ==========================================
export const calculateDPS = ({ monthlyDeposit, annualRate, months, isCompound }) => {
  const P = parseFloat(monthlyDeposit);
  const r = parseFloat(annualRate);
  const n = parseInt(months);

  if (!P || !r || !n || P <= 0 || r <= 0 || n <= 0) return null;

  const totalDeposit = P * n;
  let maturityAmount, totalInterest;

  if (isCompound) {
    // SIP Future Value formula (compound monthly)
    const monthlyRate = r / 1200;
    maturityAmount = P * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    totalInterest = maturityAmount - totalDeposit;
  } else {
    // Simple Interest DPS:
    // Each month's deposit earns interest for remaining months
    // Total Interest = P * (r/1200) * n*(n-1)/2
    const monthlyRate = r / 1200;
    totalInterest = P * monthlyRate * (n * (n - 1)) / 2;
    maturityAmount = totalDeposit + totalInterest;
  }

  return {
    monthlyDeposit: P,
    totalDeposit,
    totalInterest,
    maturityAmount,
    interestRatio: (totalInterest / totalDeposit) * 100,
  };
};

// ==========================================
// 2. FDR CALCULATOR
// Fixed Deposit Receipt — lump sum
// ==========================================
export const calculateFDR = ({ principal, annualRate, years, isCompound, compoundFreq }) => {
  const P = parseFloat(principal);
  const r = parseFloat(annualRate);
  const t = parseFloat(years);

  if (!P || !r || !t || P <= 0 || r <= 0 || t <= 0) return null;

  let maturityAmount;

  if (isCompound) {
    const freqMap = { Annual: 1, 'Semi-Annual': 2, Quarterly: 4, Monthly: 12 };
    const f = freqMap[compoundFreq] || 1;
    maturityAmount = P * Math.pow(1 + r / (100 * f), f * t);
  } else {
    maturityAmount = P * (1 + (r * t) / 100);
  }

  const totalInterest = maturityAmount - P;

  return {
    principal: P,
    totalInterest,
    maturityAmount,
    effectiveRate: (totalInterest / P / t) * 100,
    interestRatio: (totalInterest / P) * 100,
  };
};

// ==========================================
// 3. EMI CALCULATOR
// Equated Monthly Installment
// ==========================================
export const calculateEMI = ({ principal, annualRate, months }) => {
  const P = parseFloat(principal);
  const annRate = parseFloat(annualRate);
  const n = parseInt(months);

  if (!P || !annRate || !n || P <= 0 || annRate <= 0 || n <= 0) return null;

  const r = annRate / 1200; // monthly rate as decimal

  let emi;
  if (r === 0) {
    emi = P / n;
  } else {
    emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  return {
    emi,
    totalPayment,
    totalInterest,
    principal: P,
    interestPercent: (totalInterest / totalPayment) * 100,
    principalPercent: (P / totalPayment) * 100,
  };
};

// ==========================================
// 4. AMORTIZATION SCHEDULE
// Month-by-month loan breakdown
// ==========================================
export const calculateAmortization = ({ principal, annualRate, months }) => {
  const P = parseFloat(principal);
  const annRate = parseFloat(annualRate);
  const n = parseInt(months);

  if (!P || !annRate || !n || P <= 0 || annRate <= 0 || n <= 0) return null;

  const r = annRate / 1200;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  let balance = P;
  const schedule = [];
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;

  for (let month = 1; month <= n; month++) {
    const interestPayment = balance * r;
    const principalPayment = emi - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    totalInterestPaid += interestPayment;
    totalPrincipalPaid += principalPayment;

    schedule.push({
      month,
      emi,
      principal: principalPayment,
      interest: interestPayment,
      balance,
      totalInterestPaid,
    });
  }

  return {
    emi,
    schedule,
    totalPayment: emi * n,
    totalInterest: totalInterestPaid,
    principal: P,
  };
};

// ==========================================
// 5. GOAL PLANNER CALCULATOR
// How much to save/invest to reach a goal
// ==========================================
export const calculateGoalPlanner = ({
  targetAmount,
  currentSavings,
  years,
  annualRate,
}) => {
  const FV = parseFloat(targetAmount);
  const CS = parseFloat(currentSavings) || 0;
  const t = parseFloat(years);
  const r = parseFloat(annualRate);

  if (!FV || !t || !r || FV <= 0 || t <= 0 || r <= 0) return null;

  const n = t * 12; // months
  const monthlyRate = r / 1200;

  // Future value of current savings
  const fvCurrentSavings = CS * Math.pow(1 + r / 100, t);
  const remainingGoal = Math.max(0, FV - fvCurrentSavings);

  // Monthly SIP needed (compound monthly)
  const monthlySIP =
    remainingGoal > 0
      ? (remainingGoal * monthlyRate) / (Math.pow(1 + monthlyRate, n) - 1)
      : 0;

  // One-time lump sum investment needed today
  const lumpSum = remainingGoal > 0 ? remainingGoal / Math.pow(1 + r / 100, t) : 0;

  // Total SIP investment
  const totalSIPInvestment = monthlySIP * n;
  const sipInterestEarned = remainingGoal - totalSIPInvestment;

  return {
    targetAmount: FV,
    currentSavings: CS,
    fvCurrentSavings,
    remainingGoal,
    monthlySIP,
    lumpSum,
    totalSIPInvestment,
    sipInterestEarned: Math.max(0, sipInterestEarned),
    years: t,
    months: n,
    annualRate: r,
  };
};
