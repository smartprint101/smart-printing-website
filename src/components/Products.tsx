import { ArrowDown, ArrowUpRight, PackageCheck, Ruler, ShoppingBag } from "lucide-react";
import { SERVICES } from "@/data/services";
import { waLinkPacket } from "@/lib/site";
import { WhatsAppIcon } from "./ui";

const products = SERVICES.find((service) => service.id === "ready-made")?.readymadeProducts ?? [];

export function Products() {
  return (
    <section id="home" className="scroll-mt-24 bg-[#f8f9fc]">
      <div id="products" className="scroll-mt-24 mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-11 lg:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-royal-100 pb-6 sm:flex-row sm:items-end sm:pb-7">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-600">
              <span className="h-px w-7 bg-gold-500" /> Smart Printing Packaging
            </p>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight text-royal-900 sm:text-4xl">
              আপনার ব্যবসার জন্য <span className="text-royal-600">প্যাকেজিং প্রোডাক্ট</span>
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              পছন্দের প্যাকেট বেছে নিন, সরাসরি WhatsApp-এ অর্ডার করুন।
            </p>
          </div>
          <a href="#services" className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-bold text-royal-700 transition-colors hover:text-gold-600">
            আমাদের সেবা দেখুন <ArrowDown className="h-4 w-4" />
          </a>
        </div>

        <div className="mb-5 mt-7 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">Ready to order</p>
            <h2 className="mt-1 text-xl font-extrabold text-royal-900 sm:text-2xl">রেডি-মেড প্রোডাক্ট</h2>
          </div>
          <span className="rounded-full border border-royal-100 bg-white px-3 py-1.5 text-xs font-semibold text-royal-700">{products.length}টি প্রোডাক্ট</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {products.map((product, index) => (
            <article key={product.name} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e8eaf0] bg-white shadow-[0_4px_20px_rgba(13,29,68,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-royal-200 hover:shadow-card">
              <div className="relative aspect-square overflow-hidden bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  loading={index < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 rounded-md bg-royal-900 px-2 py-1 text-[9px] font-bold tracking-wide text-white sm:left-3 sm:top-3">READY-MADE</span>
              </div>
              <div className="flex flex-1 flex-col border-t border-[#f0f1f5] p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Packaging</p>
                <h3 className="mt-1 text-sm font-extrabold text-royal-900 sm:text-base">{product.name}</h3>
                <p className="mt-2 text-[10px] text-muted">আনুমানিক মূল্য</p>
                <p className="mt-0.5 text-sm font-extrabold text-royal-700 sm:text-base">{product.price}</p>
                <div className="mt-3 space-y-1.5 text-[11px] text-muted sm:text-xs">
                  <p className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5 shrink-0 text-gold-600" /> {product.size}</p>
                  <p className="flex items-center gap-1.5"><PackageCheck className="h-3.5 w-3.5 shrink-0 text-gold-600" /> মিনিমাম {product.minOrder}</p>
                </div>
                <a href={waLinkPacket(product.waMessage)} target="_blank" rel="noopener noreferrer" aria-label={`${product.name} WhatsApp-এ অর্ডার করুন`} className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-royal-900 px-2 py-2 text-xs font-bold text-white transition-colors hover:bg-royal-700 sm:text-sm">
                  <WhatsAppIcon className="h-4 w-4 shrink-0" /> অর্ডার করুন
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl border border-royal-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:px-5">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted sm:items-center sm:text-sm">
            <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-gold-600 sm:mt-0" />
            দাম আনুমানিক; সাইজ ও পরিমাণ অনুযায়ী পরিবর্তন হতে পারে।
          </p>
          <a href="#services" className="inline-flex items-center gap-1.5 text-xs font-bold text-royal-700 hover:text-gold-600 sm:text-sm">কাস্টম প্যাকেজিং দরকার? <ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </div>
    </section>
  );
}
