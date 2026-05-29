import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calculator, ArrowRightLeft, Coins } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CompareBankingModal } from "@/components/CompareBankingModal";
import { useTranslation } from "@/lib/i18n";
import { useVoiceAssistant } from "@/lib/voice";

const LOAN_TYPES = [
  { id: "home", label: "Home Loan", defaultRate: 8.5, defaultTenure: 20 },
  { id: "personal", label: "Personal Loan", defaultRate: 12.5, defaultTenure: 5 },
  { id: "education", label: "Education Loan", defaultRate: 9.5, defaultTenure: 7 },
  { id: "vehicle", label: "Vehicle Loan", defaultRate: 8.8, defaultTenure: 5 },
  { id: "gold", label: "Gold Loan", defaultRate: 10.0, defaultTenure: 1 },
  { id: "business", label: "Business Loan", defaultRate: 14.0, defaultTenure: 10 },
  { id: "msme", label: "MSME Loan", defaultRate: 11.0, defaultTenure: 5 },
];

export function EmiPlannerEngine() {
  const { t, lang } = useTranslation();
  const { speakVoice } = useVoiceAssistant();

  const [selectedType, setSelectedType] = useState(LOAN_TYPES[0]);
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(selectedType.defaultRate);
  const [tenureYears, setTenureYears] = useState(selectedType.defaultTenure);
  
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleTypeChange = (typeId: string) => {
    const type = LOAN_TYPES.find(t => t.id === typeId) || LOAN_TYPES[0];
    setSelectedType(type);
    setRate(type.defaultRate);
    setTenureYears(type.defaultTenure);
    setHasCalculated(false);
  };

  const results = useMemo(() => {
    const P = amount;
    const R = rate / 12 / 100;
    const N = tenureYears * 12;

    if (P <= 0 || tenureYears <= 0) {
      return { emi: 0, totalInterest: 0, totalAmount: 0 };
    }

    if (R === 0) {
      return {
        emi: Math.round(P / N),
        totalInterest: 0,
        totalAmount: P
      };
    }

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalAmount = emi * N;
    const totalInterest = totalAmount - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
    };
  }, [amount, rate, tenureYears]);

  const chartData = [
    { name: "Principal Amount", value: amount, color: "#94a3b8" }, // slate-400
    { name: "Total Interest", value: results.totalInterest, color: "#0f172a" } // slate-900
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

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
              <p className="text-muted-foreground mt-1 text-sm sm:text-base font-medium">{t("emiPlannerDesc") || "Simulate loan costs and compare actual bank rates"}</p>
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

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{t("loanAmount") || "Loan Amount"}</label>
                    <span className="text-[15px] font-extrabold text-foreground">{formatCurrency(amount)}</span>
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

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{t("interestRate") || "Interest Rate (%)"}</label>
                    <span className="text-[15px] font-extrabold text-foreground">{rate.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.1"
                    value={rate}
                    onChange={(e) => {
                      setRate(Number(e.target.value));
                      setHasCalculated(false);
                    }}
                    className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

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
                onClick={() => setHasCalculated(true)}
                className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white rounded-[14px] py-3.5 font-bold text-[14px] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                {t("calculateEmi") || "Calculate EMI"}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col">
            <div className={`bg-transparent flex flex-col h-full transition-all duration-500 ${hasCalculated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none absolute lg:relative w-full"}`}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Monthly EMI Card */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-border/40 flex flex-col sm:col-span-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Coins className="w-24 h-24 text-slate-900" />
                  </div>
                  <p className="text-[12px] font-extrabold text-muted-foreground uppercase tracking-wider mb-2 relative z-10">{t("monthlyEmi") || "Monthly EMI"}</p>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight relative z-10">
                    {formatCurrency(results.emi)}
                  </h2>
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
