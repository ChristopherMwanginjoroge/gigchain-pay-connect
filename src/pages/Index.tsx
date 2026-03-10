import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SchoolSection from "@/components/landing/SchoolSection";
import SolutionSection from "@/components/landing/SolutionSection";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <SchoolSection />
      <TrustSection />
      <PricingSection />
      <Footer />
    </main>
  );
};

export default Index;
