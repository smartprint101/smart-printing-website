import { cn } from "@/utils/cn";
import logo from "@/assets/logo.webp";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Smart Printing Packaging Logo"
      className={className}
    />
  );
}

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const primary = tone === "light" ? "text-white" : "text-royal-900";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[13px] font-extrabold tracking-[-0.01em] sm:text-[15px]",
            primary
          )}
        >
          SMART PRINTING
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className="h-px w-7 bg-gradient-to-r from-gold-300 to-gold-500" />
          <span className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-[9px] font-bold uppercase tracking-[0.32em] text-transparent">
            Packaging
          </span>
        </span>
      </span>
    </span>
  );
}