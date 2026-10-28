import { SERVICE_FORM_VALUES } from "@/data/services";
import { ServicePage } from "@/components/ServicePage";
import { serviceForPath, normalizePath } from "@/lib/seo";
import { guideForPath } from "@/data/guides";
import { Navbar } from "@/components/Navbar";
import { Products } from "@/components/Products";
import { Services } from "@/components/Services";
import { ShoppingHelp } from "@/components/ShoppingHelp";
import { GuideCards, GuidePage } from "@/components/Guides";
import { QuoteForm } from "@/components/QuoteForm";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

export default function App({ path = "/" }: { path?: string }) {
  const service = serviceForPath(path);
  const guide = guideForPath(path);
  const home = normalizePath(path) === "/";
  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:block focus:p-4"
      >
        মূল কনটেন্টে যান
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {home ? (
          <>
            <Products />
            <Services />
            <ShoppingHelp />
            <QuoteForm />
            <GuideCards />
            <FAQ />
            <Contact />
          </>
        ) : service ? (
          <>
            <ServicePage service={service} />
            <QuoteForm initialService={SERVICE_FORM_VALUES[service.id]} />
            <Contact />
          </>
        ) : guide ? (
          <>
            <GuidePage guide={guide} />
            <Contact />
          </>
        ) : (
          <section className="mx-auto max-w-3xl px-6 py-24 text-center">
            <p className="kicker">404 · PAGE NOT FOUND</p>
            <h1 className="mt-4 text-3xl font-bold text-royal-900">
              পেজটি পাওয়া যায়নি
            </h1>
            <p className="mt-4 text-muted">
              লিংকটি পরিবর্তিত হয়েছে অথবা এই পেজটি নেই।
            </p>
            <a
              href="/"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-royal-900 px-6 text-sm font-bold text-white"
            >
              প্রোডাক্ট দেখতে ফিরে যান
            </a>
          </section>
        )}
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
