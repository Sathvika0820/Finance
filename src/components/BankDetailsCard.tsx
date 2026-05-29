import React from 'react';
import { BankDetails } from '../services/ifsc';
import { Building2, MapPin, Hash, Phone } from 'lucide-react';

export function BankDetailsCard({ details }: { details: BankDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-blue-50 border-b border-blue-100 p-4">
        <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
          <Building2 className="text-blue-600" />
          {details.BANK}
        </h2>
        <p className="text-blue-700 font-medium ml-8">{details.BRANCH}</p>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="text-slate-400 mt-1 shrink-0 w-5 h-5" />
          <div>
            <p className="text-sm font-medium text-slate-500">Address</p>
            <p className="text-slate-800">{details.ADDRESS}</p>
            <p className="text-slate-600 text-sm">{details.CITY}, {details.STATE}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Hash className="text-slate-400 mt-1 shrink-0 w-5 h-5" />
            <div>
              <p className="text-sm font-medium text-slate-500">IFSC Code</p>
              <p className="text-slate-800 font-semibold">{details.IFSC}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="text-slate-400 mt-1 shrink-0 w-5 h-5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Contact</p>
              <p className="text-slate-800">{details.CONTACT || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
