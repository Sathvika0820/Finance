export function OsmaniaLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logos/osmania home logo.png" 
        alt="Osmania University Home Logo"
        className="w-16 h-16 object-contain"
      />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold tracking-wider text-white/90 uppercase">
          Osmania
        </span>
        <span className="text-[8px] font-medium tracking-wide text-white/60 uppercase">
          University
        </span>
      </div>
    </div>
  );
}

