export function OTBILogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logos/OTBI_logo.png" 
        alt="OTBI Logo"
        className="w-12 h-12 object-contain"
      />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold tracking-wider text-white/90 uppercase">
          OTBI
        </span>
        <span className="text-[8px] font-medium tracking-wide text-white/60 uppercase">
          Idea Labs
        </span>
      </div>
    </div>
  );
}

