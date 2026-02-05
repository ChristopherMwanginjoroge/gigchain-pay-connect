import HeroSection from "@/components/HeroSection";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import KeyFeatures from "@/components/KeyFeatures";
import BusinessModel from "@/components/BusinessModel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSolution />
      <HowItWorks />
      <KeyFeatures />
      <BusinessModel />
      <Footer />
    </main>
  );
};

export default Index;
