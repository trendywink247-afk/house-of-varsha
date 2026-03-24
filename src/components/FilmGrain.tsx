/**
 * Subtle noise texture overlay for an editorial luxury feel.
 * Pure CSS — zero JS runtime cost.
 */
export function FilmGrain() {
  return (
    <>
      <style>{`
        @keyframes hov-grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -15%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 10%); }
          80% { transform: translate(3%, -15%); }
          90% { transform: translate(-10%, 10%); }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            position: 'absolute',
            inset: '-50%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            animation: 'hov-grain 0.1s steps(3) infinite',
            willChange: 'transform',
          }}
        />
      </div>
    </>
  );
}
