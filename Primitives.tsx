import React, { useEffect, useRef, useState } from 'react';

/* ============================================
   Animated number counter
   ============================================ */
export const Counter: React.FC<{ value: number; duration?: number; decimals?: number; suffix?: string; prefix?: string; className?: string }> = ({ value, duration = 1200, decimals = 0, suffix = '', prefix = '', className = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(value * eased);
          if (progress < 1) requestAnimationFrame(animate);
          else setDisplay(value);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
};

/* ============================================
   Decorative animated mesh background
   ============================================ */
export const MeshBackground: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <div className="mesh-orb w-[28rem] h-[28rem] bg-emerald-300 -top-32 -left-24 animate-floatSlow" />
    <div className="mesh-orb w-[24rem] h-[24rem] bg-cyan-300 top-1/3 -right-24 animate-floatSlow" style={{ animationDelay: '3s' }} />
    <div className="mesh-orb w-[22rem] h-[22rem] bg-indigo-300 -bottom-32 left-1/3 animate-floatSlow" style={{ animationDelay: '6s' }} />
  </div>
);

/* ============================================
   Radial progress ring
   ============================================ */
export const ProgressRing: React.FC<{ value: number; size?: number; stroke?: number; gradientId?: string; children?: React.ReactNode }> = ({ value, size = 120, stroke = 10, gradientId = 'ringGrad', children }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (animated / 100) * circ}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

/* ============================================
   Premium section header
   ============================================ */
export const SectionHeader: React.FC<{ eyebrow?: string; title: React.ReactNode; subtitle?: string; icon?: React.ReactNode; action?: React.ReactNode }> = ({ eyebrow, title, subtitle, icon, action }) => (
  <div className="flex items-end justify-between gap-4 flex-wrap">
    <div>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-600 mb-2">
          {icon}{eyebrow}
        </span>
      )}
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{subtitle}</p>}
    </div>
    {action}
  </div>
);
