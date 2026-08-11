import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { About } from "@/components/About";
import { ProductFinder } from "@/components/ProductFinder";
import { Services } from "@/components/Services";
import { FreeDesign } from "@/components/FreeDesign";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { Budget } from "@/components/Budget";
import { BudgetEstimator } from "@/components/BudgetEstimator";
import { WhyChooseUs, WhoWeServe } from "@/components/WhyServe";
import { Showcase } from "@/components/Showcase";
import { Portfolio } from "@/components/Portfolio";
import { QuickQuote } from "@/components/QuickQuote";
import { QuoteForm } from "@/components/QuoteForm";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <About />
        <ProductFinder />
        <Services />
        <FreeDesign />
        <Process />
        <Pricing />
        <Budget />
        <BudgetEstimator />
        <WhyChooseUs />
        <WhoWeServe />
        <Showcase />
        <Portfolio />
        <QuickQuote />
        <QuoteForm />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
      {/* spacer so mobile bottom bar doesn't cover footer content */}
      <div className="h-16 md:hidden" />
    </div>
  );
}