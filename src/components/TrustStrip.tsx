import { Boxes, Palette, Headset, Users } from "lucide-react";
import { Container, CountUp, Reveal } from "./ui";

const items = [
  {
    icon: Users,
    big: (
      <span className="inline-flex items-baseline">
        <CountUp end={2000} />+
      </span>
    ),
    label: "প্রতিষ্ঠানের সাথে কাজের অভিজ্ঞতা",
  },
  {
    icon: Boxes,
    big: "Custom",
    label: "Printing & Packaging",
  },
  {
    icon: Palette,
    big: "ডিজাইন",
    label: "ফ্রি (সংশ্লিষ্ট কাজে)",
  },
  {
    icon: Headset,
    big: (
      <span className="inline-flex items-baseline gap-0.5">
        <CountUp end={24} />
        <span className="text-[11px]">/7</span>
      </span>
    ),
    label: "Online Support",
  },
];

export function TrustStrip() {
  return (
    <section className="relative z-10 -mt-6 bg-transparent pb-3 sm:-mt-8 sm:pb-4">
      <Container>
        <Reveal className="overflow-hidden rounded-xl border border-line bg-white shadow-soft sm:rounded-2xl">
          <div className="grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
            {items.map(({ icon: Icon, big, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 p-3 sm:gap-3 sm:p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-royal-50 text-royal-700 sm:h-9 sm:w-9">
                  <Icon className="h-4 w-4 shrink-0 sm:h-4.5 sm:w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-extrabold leading-none text-ink sm:text-[16px]">
                    {big}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] font-medium leading-[1.2] text-muted sm:text-[11px]">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
