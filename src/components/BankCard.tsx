import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink, Info, Heart } from "lucide-react";
import { Bank, getBankDisplayName } from "@/data/banks";
import { BankLogo } from "./BankLogo";
import { pushRecent, useFavorites } from "@/lib/favorites";
import { openBank, speakVoice } from "@/lib/voice";
import { useTranslation } from "@/lib/i18n";

function getCatKey(cat: string) {
  const map: Record<string, string> = {
    "Public Sector": "publicSector",
    "Private Sector": "privateSector",
    "Small Finance": "smallFinance",
    "Payments": "payments",
    "Regional Rural": "regionalRural",
    "Co-operative": "cooperative"
  };
  return map[cat] || cat;
}

export function BankCard({ bank, index = 0 }: { bank: Bank; index?: number }) {
  const navigate = useNavigate();
  const { lang, t } = useTranslation();
  const { toggle, isFavorite } = useFavorites();
  const isFav = isFavorite(bank.id);
  const displayName = getBankDisplayName(bank, lang);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 10) * 0.03 }}
      className="glass shadow-soft rounded-2xl flex items-center gap-3 active:scale-[0.99] transition-transform"
    >
      <button
        onClick={(e) => {
          pushRecent(bank.id);
          openBank(bank, "bank_card", e);
        }}
        className="flex items-center gap-3 flex-1 min-w-0 p-4 text-left"
        aria-label={`Open ${displayName} official website`}
      >
        <BankLogo bank={bank} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate text-[15px]">{displayName}</p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <ExternalLink className="w-3 h-3" /> {t(getCatKey(bank.category))}
          </p>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!isFav) {
            speakVoice("bankSelected", { bank });
          } else {
            speakVoice("bankRemoved", { bank });
          }
          toggle(bank.id);
        }}
        aria-label={`${isFav ? 'Remove from' : 'Add to'} favorites`}
        className={`p-4 transition-colors ${isFav ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          navigate({ to: "/banks/$bankId", params: { bankId: bank.id } });
        }}
        aria-label={`View ${displayName} details`}
        className="p-4 text-muted-foreground hover:text-foreground"
      >
        <Info className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function BankTile({ bank }: { bank: Bank }) {
  const { lang } = useTranslation();
  const { toggle, isFavorite } = useFavorites();
  const isFav = isFavorite(bank.id);
  const displayName = getBankDisplayName(bank, lang);
  
  return (
    <div className="glass shadow-soft rounded-2xl p-4 flex flex-col items-center gap-2 min-w-[110px] relative">
      <button
        onClick={(e) => {
          pushRecent(bank.id);
          openBank(bank, "bank_tile", e);
        }}
        className="flex flex-col items-center gap-2"
        aria-label={`Open ${displayName} official website`}
      >
        <BankLogo bank={bank} size="lg" />
        <p className="text-[11px] font-medium text-foreground text-center line-clamp-1">
          {displayName}
        </p>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!isFav) {
            speakVoice("bankSelected", { bank });
          } else {
            speakVoice("bankRemoved", { bank });
          }
          toggle(bank.id);
        }}
        aria-label={`${isFav ? 'Remove from' : 'Add to'} favorites`}
        className={`absolute top-2 right-2 p-1.5 rounded-lg transition-colors ${isFav ? 'text-red-500 hover:text-red-600 bg-white/80' : 'text-muted-foreground hover:text-foreground bg-white/60'}`}
      >
        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
}

export function BankGridCard({ bank }: { bank: Bank }) {
  const navigate = useNavigate();
  const { lang } = useTranslation();
  const { toggle, isFavorite } = useFavorites();
  const isFav = isFavorite(bank.id);
  const displayName = getBankDisplayName(bank, lang);
  
  return (
    <div className="glass shadow-soft rounded-2xl p-4 flex flex-col items-center text-center gap-2 relative">
      <button onClick={(e) => {
          pushRecent(bank.id);
          openBank(bank, "bank_grid_card", e);
        }} className="contents" aria-label={`Open ${displayName}`}>
        <BankLogo bank={bank} size="lg" />
        <p className="text-xs font-semibold text-foreground line-clamp-2 mt-2">{displayName}</p>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          navigate({ to: "/banks/$bankId", params: { bankId: bank.id } });
        }}
        className="text-[10px] text-muted-foreground"
      >
        Details
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!isFav) {
            speakVoice("bankSelected", { bank });
          } else {
            speakVoice("bankRemoved", { bank });
          }
          toggle(bank.id);
        }}
        aria-label={`${isFav ? 'Remove from' : 'Add to'} favorites`}
        className={`absolute top-2 right-2 p-1.5 rounded-lg transition-colors ${isFav ? 'text-red-500 hover:text-red-600 bg-white/80' : 'text-muted-foreground hover:text-foreground bg-white/60'}`}
      >
        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
}