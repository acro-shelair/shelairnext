const HeroBadges = () => {
  return (
    <>
      <div
        className="absolute -top-5 -right-6 gradient-cta text-primary-foreground rounded-xl px-4 py-3 shadow-xl"
        style={{ animation: "hero-float-y 4s ease-in-out 1.5s infinite" }}
      >
        <div className="text-sm font-bold">ARC Licensed</div>
        <div className="text-xs opacity-75">Licence AU61340</div>
      </div>

      <div
        className="absolute top-1/2 -left-10 -translate-y-1/2 bg-background border border-border rounded-xl px-4 py-3 shadow-xl flex items-center gap-2"
        style={{ animation: "hero-float-x 3s ease-in-out 1.6s infinite" }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <div>
          <div className="text-sm font-bold text-foreground leading-none">
            24/7 Support
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Emergency Response
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-6 -right-8 bg-background border border-border rounded-xl px-5 py-4 shadow-xl"
        style={{ animation: "hero-float-y-alt 4s ease-in-out 1.5s infinite" }}
      >
        <div className="text-3xl font-extrabold text-primary leading-none">
          30+
        </div>
        <div className="text-xs text-muted-foreground font-medium mt-1">
          Years of Excellence
        </div>
      </div>

      <style>{`
        @keyframes hero-float-y {
          0%,100% { transform: translateY(0) }
          25% { transform: translateY(-5px) }
          75% { transform: translateY(5px) }
        }
        @keyframes hero-float-y-alt {
          0%,100% { transform: translateY(0) }
          25% { transform: translateY(5px) }
          75% { transform: translateY(-5px) }
        }
        @keyframes hero-float-x {
          0%,100% { transform: translate(0, -50%) }
          25% { transform: translate(-4px, -50%) }
          75% { transform: translate(4px, -50%) }
        }
      `}</style>
    </>
  );
};

export default HeroBadges;
