import { cn } from '@/lib/utils';

export function HomeClosing({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'zen-home-section relative overflow-hidden rounded-zen-xl px-5 py-7 text-center md:rounded-zen-2xl md:px-10 md:py-10',
        className,
      )}
      aria-label="Closing thought"
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,hsl(250,26%,24%)_0%,hsl(262,30%,28%)_48%,hsl(240,24%,20%)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-35"
        style={{
          background:
            'radial-gradient(ellipse at 50% 10%, hsl(262 48% 58% / 0.4), transparent 55%)',
        }}
        aria-hidden="true"
      />
      {/* Quiet night texture — sparse dots, not a starfield */}
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <span className="absolute left-[18%] top-[28%] h-0.5 w-0.5 rounded-full bg-white/70" />
        <span className="absolute left-[72%] top-[22%] h-1 w-1 rounded-full bg-white/50" />
        <span className="absolute left-[58%] top-[62%] h-0.5 w-0.5 rounded-full bg-white/60" />
        <span className="absolute left-[30%] top-[70%] h-[3px] w-[3px] rounded-full bg-white/35" />
        <span className="absolute left-[82%] top-[48%] h-0.5 w-0.5 rounded-full bg-white/55" />
      </div>
      <div className="relative z-10 max-w-md mx-auto">
        <p className="font-ui text-[0.875rem] text-white/70 leading-relaxed">
          You don&apos;t have to have it all figured out.
        </p>
        <p className="font-display text-[1.125rem] leading-snug tracking-tight font-semibold text-white/95 mt-2.5 md:text-[1.45rem]">
          Just take the next right step.
        </p>
      </div>
    </section>
  );
}
