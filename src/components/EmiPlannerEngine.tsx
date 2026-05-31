import { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calculator, ArrowRightLeft, Coins } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CompareBankingModal } from "@/components/CompareBankingModal";
import { useTranslation } from "@/lib/i18n";
import { useVoiceAssistant } from "@/lib/voice";
import { BANKS, getBankDisplayName } from "@/data/banks";
import { getSortedLoanComparison, LoanComparisonLoanType } from "@/data/loanData";
import { fetchDynamicLoanRate } from "@/services/loanRateService";

const LOAN_TYPES: { id: LoanComparisonLoanType; label: string; defaultTenure: number }[] = [
  { id: "home_loan", label: "Home Loan", defaultTenure: 20 },
  { id: "personal_loan", label: "Personal Loan", defaultTenure: 5 },
  { id: "education_loan", label: "Education Loan", defaultTenure: 7 },
  { id: "vehicle_loan", label: "Vehicle Loan", defaultTenure: 5 },
  { id: "gold_loan", label: "Gold Loan", defaultTenure: 1 },
  { id: "business_loan", label: "Business Loan", defaultTenure: 10 },
  { id: "msme_loan", label: "MSME Loan", defaultTenure: 5 },
];

export function EmiPlannerEngine() {
  const { t, lang } = useTranslation();
  const { speakVoice } = useVoiceAssistant();

  const [selectedBankId, setSelectedBankId] = useState(BANKS[0].id);
  const [selectedType, setSelectedType] = useState(LOAN_TYPES[0]);
  const [salary, setSalary] = useState(50000);
  const [amount, setAmount] = useState(5000000);
  const [tenureYears, setTenureYears] = useState(selectedType.defaultTenure);
  
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleBankChange = (bankId: string) => {
    setSelectedBankId(bankId);
    setHasCalculated(false);
  };

  const handleTypeChange = (typeId: string) => {
    const type = LOAN_TYPES.find(t => t.id === typeId) || LOAN_TYPES[0];
    setSelectedType(type);
    setTenureYears(type.defaultTenure);
    setHasCalculated(false);
  };

  const [autoRate, setAutoRate] = useState<number | null>(null);
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [rateIsDynamic, setRateIsDynamic] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsRateLoading(true);
    setHasCalculated(false);

    fetchDynamicLoanRate(selectedBankId, selectedType.id)
      .then(res => {
        if (isMounted) {
          setAutoRate(res.interestRate);
          setRateIsDynamic(res.isDynamic);
        }
      })
      .finally(() => {
        if (isMounted) setIsRateLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedBankId, selectedType.id]);

  const results = useMemo(() => {
    const P = amount;
    const rate = autoRate;
    const N = tenureYears * 12;

    if (P <= 0 || tenureYears <= 0 || rate === null) {
      return { emi: 0, totalInterest: 0, totalAmount: 0, affordableLoan: 0 };
    }

    const R = rate / 12 / 100;
    let emi = 0;
    let affordableLoan = 0;
    const maxEmi = salary * 0.40;

    if (R === 0) {
      emi = Math.round(P / N);
      affordableLoan = maxEmi * N;
    } else {
      emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      affordableLoan = (maxEmi * (Math.pow(1 + R, N) - 1)) / (R * Math.pow(1 + R, N));
    }
    
    const totalAmount = emi * N;
    const totalInterest = totalAmount - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      affordableLoan: Math.round(affordableLoan)
    };
  }, [amount, autoRate, tenureYears, salary]);

  const chartData = [
    { name: "Principal Amount", value: amount, color: "#94a3b8" }, // slate-400
    { name: "Total Interest", value: results.totalInterest, color: "#0f172a" } // slate-900
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const selectedBankName = getBankDisplayName(BANKS.find(b => b.id === selectedBankId), lang) || selectedBankId;

  const emiRatio = salary > 0 ? (results.emi / salary) * 100 : 0;
  let affordabilityStatus = t("comfortable") || "Comfortable";
  let statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
  
  if (emiRatio > 50) {
    affordabilityStatus = t("highFinancialBurden") || "High Financial Burden";
    statusColor = "text-rose-600 bg-rose-50 border-rose-200";
  } else if (emiRatio >= 30) {
    affordabilityStatus = t("manageable") || "Manageable";
    statusColor = "text-amber-600 bg-amber-50 border-amber-200";
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 sm:pb-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back to Dashboard</span>
        </Link>
        
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center border border-border/40 shadow-sm">
              <Calculator className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{t("emiPlannerPro") || "EMI Planner Pro"}</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base font-medium">{t("emiPlannerDesc") || "Calculate EMIs, compare loan costs, and plan your finances smarter."}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-[13px] transition-all shadow-sm active:scale-[0.98]"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Compare {selectedType.label}s
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Inputs Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-border/40">
              <h2 className="text-lg font-bold text-foreground mb-6">{t("loanDetails") || "Loan Details"}</h2>
              
              <div className="space-y-6">
                
                {/* Bank Selection */}
                <div>
                  <label className="block text-[13px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t("selectBank") || "Select Bank"}</label>
                  <select
                    className="w-full bg-slate-50 border border-border/60 text-foreground text-[14px] rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                    value={selectedBankId}
                    onChange={(e) => handleBankChange(e.target.value)}
                  >
                    {BANKS.map((bank) => (
                      <option key={bank.id} value={bank.id}>{getBankDisplayName(bank, lang)}</option>
                    ))}
                  </select>
                </div>

                {/* Loan Type */}
                <div>
                  <label className="block text-[13px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t("loanType") || "Loan Type"}</label>
                  <select
                    className="w-full bg-slate-50 border border-border/60 text-foreground text-[14px] rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                    value={selectedType.id}
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    {LOAN_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Auto Interest Rate Display */}
                <div>
                  <label className="block text-[13px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t("interestRate") || "Interest Rate (%)"}</label>
                  <div className="w-full bg-slate-100 border border-slate-200 text-slate-700 text-[14px] rounded-xl px-4 py-3 font-bold transition-all flex items-center justify-between">
                    {isRateLoading ? (
                      <span className="text-slate-400 font-semibold animate-pulse">Fetching rate...</span>
                    ) : autoRate !== null ? (
                      <>
                        <div className="flex flex-col">
                          <span>{autoRate.toFixed(2)}%</span>
                          {!rateIsDynamic && (
                            <span className="text-[10px] text-amber-600 font-semibold mt-0.5">Latest rate unavailable. Using last verified rate.</span>
                          )}
                        </div>
                        <span className="text-[10px] uppercase font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded ml-2">Auto</span>
                      </>
                    ) : (
                      <span className="text-amber-600 text-[13px] font-semibold">{t("rateUnavailable") || "Latest rate unavailable. Using last verified rate."}</span>
                    )}
                  </div>
                </div>

                {/* Salary Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{t("monthlySalary") || "Monthly Salary"}</label>
                  </div>
                  <div className="relative mb-3">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      min="10000"
                      value={salary || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setSalary(val);
                        setHasCalculated(false);
                      }}
                      className="w-full bg-slate-50 border border-border/60 text-foreground text-[16px] rounded-xl pl-8 pr-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                    />
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="5000"
                    value={salary}
                    onChange={(e) => {
                      setSalary(Number(e.target.value));
                      setHasCalculated(false);
                    }}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[11px] text-slate-400 font-bold">₹10K</span>
                    <span className="text-[11px] text-slate-400 font-bold">₹10L</span>
                  </div>
                </div>

                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{t("loanAmount") || "Loan Amount"}</label>
                  </div>
                  <div className="relative mb-3">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      min="10000"
                      value={amount || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setAmount(val);
                        setHasCalculated(false);
                      }}
                      className="w-full bg-slate-50 border border-border/60 text-foreground text-[16px] rounded-xl pl-8 pr-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[50000, 100000, 500000, 1000000, 2500000, 5000000].map(val => (
                      <button 
                        key={val}
                        onClick={() => { setAmount(val); setHasCalculated(false); }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[12px] font-bold transition-colors active:scale-95"
                      >
                        ₹{val >= 100000 ? `${val/100000}L` : `${val/1000}K`}
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="10000"
                    max="100000000"
                    step="10000"
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setHasCalculated(false);
                    }}
                    className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[11px] text-slate-400 font-bold">₹10K</span>
                    <span className="text-[11px] text-slate-400 font-bold">₹10Cr</span>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{t("loanTenureYears") || "Loan Tenure (Years)"}</label>
                    <span className="text-[15px] font-extrabold text-foreground">{tenureYears} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => {
                      setTenureYears(Number(e.target.value));
                      setHasCalculated(false);
                    }}
                    className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (autoRate !== null) setHasCalculated(true);
                }}
                disabled={autoRate === null}
                className={`w-full mt-8 rounded-[14px] py-3.5 font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
                  autoRate !== null 
                    ? "bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.98] shadow-sm cursor-pointer" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70"
                }`}
              >
                <Calculator className="w-4 h-4" />
                {t("calculateEmi") || "Calculate EMI"}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col">
            <div className={`bg-transparent flex flex-col h-full transition-all duration-500 ${hasCalculated && autoRate !== null ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none absolute lg:relative w-full"}`}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Monthly EMI Card */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/40 flex flex-col sm:col-span-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Coins className="w-24 h-24 text-slate-900" />
                  </div>
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <p className="text-[12px] font-extrabold text-muted-foreground uppercase tracking-wider mb-2">{t("monthlyEmi") || "Monthly EMI"}</p>
                      <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        {formatCurrency(results.emi)}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-extrabold text-muted-foreground uppercase tracking-wider mb-2">{t("emiToSalaryRatio") || "EMI-to-Salary Ratio"}</p>
                      <h2 className="text-2xl font-extrabold text-slate-700">
                        {emiRatio.toFixed(1)}%
                      </h2>
                    </div>
                  </div>
                  
                  <div className={`mt-6 px-4 py-3 rounded-xl border flex items-center justify-between z-10 ${statusColor}`}>
                    <span className="font-bold text-sm">{t("affordabilityStatus") || "Affordability Status"}:</span>
                    <span className="font-extrabold text-sm">{affordabilityStatus}</span>
                  </div>
                </div>
                
                {/* Max Recommended Loan Card */}
                <div className="bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-800 flex flex-col justify-center sm:col-span-2 text-white">
                   <div className="flex justify-between items-center mb-3">
                     <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{t("recommendedMaxEmi") || "Recommended Maximum EMI"}</p>
                     <span className="text-[15px] font-bold text-emerald-400">{formatCurrency(salary * 0.4)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{t("estimatedAffordableLoan") || "Estimated Affordable Loan"}</p>
                     <span className="text-[18px] font-extrabold text-white">{formatCurrency(results.affordableLoan)}</span>
                   </div>
                </div>

                {/* Total Interest */}
                <div className="bg-white rounded-[20px] p-5 shadow-sm border border-border/40 flex flex-col justify-center">
                  <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1.5">{t("totalInterest") || "Total Interest"}</p>
                  <p className="text-[20px] font-extrabold text-slate-900">{formatCurrency(results.totalInterest)}</p>
                </div>

                {/* Total Payment */}
                <div className="bg-white rounded-[20px] p-5 shadow-sm border border-border/40 flex flex-col justify-center">
                  <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1.5">{t("totalPayment") || "Total Payment"}</p>
                  <p className="text-[20px] font-extrabold text-slate-900">{formatCurrency(results.totalAmount)}</p>
                </div>
              </div>

              {/* Chart Card */}
              <div className="bg-white rounded-[24px] shadow-sm border border-border/40 p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wider mb-6 text-center w-full">{t("principalVsInterest") || "Principal vs Interest"}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                      itemStyle={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-[12px] font-bold text-slate-700 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      <CompareBankingModal 
        isOpen={isCompareOpen} 
        onClose={() => setIsCompareOpen(false)} 
        t={t} 
        lang={lang} 
        speakVoice={speakVoice}
        openBankSafely={(bank) => console.log('Open bank', bank)}
      />
    </div>
  );
}
