export function CrestLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      <img 
        src="/logos/osmania_logo.png" 
        alt="Osmania University Logo"
        className="h-full w-auto object-contain"
      />
      <div className="w-px h-8 bg-border/40" />
      <img 
        src="/logos/OTBI_logo.png" 
        alt="OTBI Logo"
        className="h-[85%] w-auto object-contain"
      />
    </div>
  );
}
