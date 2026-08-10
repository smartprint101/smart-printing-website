import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";
import { cn } from "@/utils/cn";

/* ----------------------------------------------------------------
   WhatsApp glyph (brand icon — not available in lucide)
----------------------------------------------------------------- */
export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ----------------------------------------------------------------
   Scroll reveal wrapper
----------------------------------------------------------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------------
   Layout helpers
----------------------------------------------------------------- */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-3.5 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  light = false,
  className,
}: {
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs",
        light ? "text-gold-300" : "text-gold-600",
        className
      )}
    >
      <span className={cn("h-px w-6 sm:w-7", light ? "bg-gold-300/70" : "bg-gold-500/70")} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && (
        <div className={cn(center && "flex justify-center")}>
          <Eyebrow light={light}>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2
        className={cn(
          "mt-2.5 text-[22px] font-extrabold leading-tight sm:text-[30px]",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-2.5 text-[13px] leading-relaxed sm:text-[14px]", light ? "text-royal-100/80" : "text-muted")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   Button
----------------------------------------------------------------- */
type Variant = "gold" | "royal" | "whatsapp" | "outlineGold" | "outlineLight" | "white";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  gold: "bg-gradient-to-b from-gold-300 to-gold-500 text-royal-900 shadow-[var(--shadow-gold)] hover:from-gold-200 hover:to-gold-400",
  royal: "bg-royal-700 text-white hover:bg-royal-800",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1fb858] shadow-[0_12px_30px_-12px_rgba(37,211,102,0.6)]",
  outlineGold: "border border-gold-400/70 text-gold-600 hover:bg-gold-50",
  outlineLight: "border border-white/30 text-white hover:bg-white/10",
  white: "bg-white text-royal-800 hover:bg-royal-50 shadow-card",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-2 text-[13px] gap-1.5",
  md: "px-4 py-2.5 text-[13px] gap-1.5 sm:text-[14px]",
  lg: "px-5 py-3 text-[14px] gap-2 sm:text-[15px]",
};

export function Button({
  href,
  onClick,
  variant = "royal",
  size = "md",
  className,
  children,
  target,
  rel,
  ariaLabel,
}: {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={cn(
        "group inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </a>
  );
}

/* ----------------------------------------------------------------
   Count-up (only for verified/static facts)
----------------------------------------------------------------- */
export function CountUp({
  end,
  duration = 1600,
  suffix = "",
  prefix = "",
  className,
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* ----------------------------------------------------------------
   Small "approx price" chip
----------------------------------------------------------------- */
export function PriceTag({
  label,
  value,
  tone = "gold",
}: {
  label?: string;
  value: string;
  tone?: "gold" | "royal" | "muted";
}) {
  const tones = {
    gold: "bg-gold-50 text-gold-700 ring-gold-200",
    royal: "bg-royal-50 text-royal-700 ring-royal-100",
    muted: "bg-mist text-muted ring-line",
  };
  return (
    <span
      className={cn(
        "inline-flex flex-col rounded-lg px-3 py-1.5 ring-1",
        tones[tone]
      )}
    >
      {label && <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</span>}
      <span className="text-sm font-bold leading-tight">{value}</span>
    </span>
  );
}
