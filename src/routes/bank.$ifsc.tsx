import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { fetchBankDetails, BankDetails } from '../services/ifsc';
import { BankDetailsCard } from '../components/BankDetailsCard';
import { Loader2, ArrowLeft, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/bank/$ifsc')({
  component: BankServices,
});

function BankServices() {
  const { ifsc } = useParams({ from: '/bank/$ifsc' });
  const [details, setDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const data = await fetchBankDetails(ifsc);
      if (data) {
        setDetails(data);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    loadDetails();
  }, [ifsc]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-slate-600 font-medium">Finding your bank details...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            !
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Bank Not Found</h2>
          <p className="text-slate-600 mb-6">We couldn't find any bank with the IFSC code "{ifsc}". Please check and try again.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </Link>

        {/* Bank Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <BankDetailsCard details={details} />
        </motion.div>

        {/* Services List Removed (Moved to Premium) */}

      </div>
    </div>
  );
}
