import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Calculator, ChevronDown, PackageSearch } from "lucide-react";
import { Container } from "./ui";
import { waLink } from "@/lib/site";

// These optional tools load on demand so the initial page stays fast.
const ProductFinder = lazy(() =>
  import("./ProductFinder").then((module) => ({
    default: module.ProductFinder,
  })),
);
const BudgetEstimator = lazy(() =>
  import("./BudgetEstimator").then((module) => ({
    default: module.BudgetEstimator,
  })),
);

function ToolFallback({
  loading = false,
  failed = false,
}: {
  loading?: boolean;
  failed?: boolean;
}) {
  const message = loading
    ? "টুলটি লোড হচ্ছে। "
    : failed
      ? "টুলটি লোড করা যায়নি। পেজটি আবার খুলুন অথবা "
      : "টুলটি ব্যবহার করতে JavaScript প্রয়োজন। প্রয়োজনে ";
  return (
    <p
      className="px-5 pb-5 text-sm leading-7 text-muted"
      role={loading ? "status" : undefined}
    >
      {message}
      <a
        className="font-bold text-royal-800 underline"
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp-এ সরাসরি যোগাযোগ করুন
      </a>
      ।
    </p>
  );
}

// A failed optional chunk must not remove the main storefront or contact path.
class ToolErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <ToolFallback failed /> : this.props.children;
  }
}

export function PackagingTools() {
  const [finderOpen, setFinderOpen] = useState(false);
  const [finderLoaded, setFinderLoaded] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorLoaded, setCalculatorLoaded] = useState(false);

  useEffect(() => {
    const openLinkedTool = () => {
      if (window.location.hash === "#product-finder") {
        setFinderLoaded(true);
        setFinderOpen(true);
      } else if (window.location.hash === "#budget") {
        setCalculatorLoaded(true);
        setCalculatorOpen(true);
      }
    };
    openLinkedTool();
    window.addEventListener("hashchange", openLinkedTool);
    return () => window.removeEventListener("hashchange", openLinkedTool);
  }, []);

  return (
    <section
      id="tools"
      className="scroll-mt-28 border-b border-line bg-white py-10 sm:py-14"
    >
      <Container>
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="kicker">SMART PACKAGING TOOLS</p>
            <h2 className="mt-2 text-2xl font-extrabold text-royal-900 sm:text-3xl">
              প্যাকেট ফাইন্ডার ও সিলিন্ডার বাজেট ক্যালকুলেটর
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              কোন প্যাকেট উপযুক্ত হবে খুঁজে নিন অথবা সাইজ ও রঙ দিয়ে সিলিন্ডার ও
              প্যাকেটের আনুমানিক খরচ হিসাব করুন।
            </p>
          </div>
          <p className="text-xs text-muted">
            ক্লিক করে টুল খুলুন · হিসাব প্রাথমিক ধারণা
          </p>
        </div>

        <details
          id="product-finder"
          open={finderOpen}
          onToggle={(event) => {
            const open = event.currentTarget.open;
            setFinderOpen(open);
            if (open) setFinderLoaded(true);
          }}
          className="tool-disclosure mb-4 overflow-hidden rounded-2xl border border-[#ddd9cf] bg-[#faf9f5] transition-colors open:bg-white"
        >
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <span className="flex items-center gap-3.5 sm:gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-royal-900 text-gold-300"
              >
                <PackageSearch size={21} />
              </span>
              <span>
                <span className="block text-base font-extrabold text-royal-900 sm:text-lg">
                  প্যাকেট ফাইন্ডার
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted sm:text-sm">
                  ৩টি প্রশ্নের উত্তরে পণ্যের জন্য উপযুক্ত প্যাকেট খুঁজে নিন
                </span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#d6d1c4] bg-white px-3.5 py-2 text-xs font-bold text-royal-900">
              <span className="hidden sm:inline">
                {finderOpen ? "বন্ধ করুন" : "খুঁজুন"}
              </span>
              <ChevronDown
                size={17}
                className="tool-chevron shrink-0 transition-transform"
              />
            </span>
          </summary>
          {finderLoaded ? (
            <ToolErrorBoundary>
              <Suspense fallback={<ToolFallback loading />}>
                <ProductFinder
                  onOpenCalculator={() => {
                    setCalculatorLoaded(true);
                    setCalculatorOpen(true);
                  }}
                />
              </Suspense>
            </ToolErrorBoundary>
          ) : (
            <ToolFallback />
          )}
        </details>

        <details
          id="budget"
          open={calculatorOpen}
          onToggle={(event) => {
            const open = event.currentTarget.open;
            setCalculatorOpen(open);
            if (open) setCalculatorLoaded(true);
          }}
          className="tool-disclosure overflow-hidden rounded-2xl border border-[#ddd9cf] bg-[#faf9f5] transition-colors open:bg-white"
        >
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <span className="flex items-center gap-3.5 sm:gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#996034] text-white"
              >
                <Calculator size={21} />
              </span>
              <span>
                <span className="block text-base font-extrabold text-royal-900 sm:text-lg">
                  বাজেট ক্যালকুলেটর (সিলিন্ডার ও প্যাকেট)
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted sm:text-sm">
                  প্যাকেটের মাপ ও রঙের সংখ্যা দিয়ে সিলিন্ডার ও প্রিন্টের দাম
                  হিসাব করুন
                </span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#d6d1c4] bg-white px-3.5 py-2 text-xs font-bold text-royal-900">
              <span className="hidden sm:inline">
                {calculatorOpen ? "বন্ধ করুন" : "হিসাব করুন"}
              </span>
              <ChevronDown
                size={17}
                className="tool-chevron shrink-0 transition-transform"
              />
            </span>
          </summary>
          {calculatorLoaded ? (
            <ToolErrorBoundary>
              <Suspense fallback={<ToolFallback loading />}>
                <BudgetEstimator />
              </Suspense>
            </ToolErrorBoundary>
          ) : (
            <ToolFallback />
          )}
        </details>
      </Container>
    </section>
  );
}
