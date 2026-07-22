import type { ReactNode } from 'react';

export function ActivaHero({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] bg-[#1A1D21] text-white ${className}`}
      style={{
        backgroundImage:
          "url('/brand/graphics/hero-background-dark.svg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="relative z-10">{children}</div>
    </section>
  );
}
