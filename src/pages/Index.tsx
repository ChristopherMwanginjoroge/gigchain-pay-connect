import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSolution from "@/components/ProblemSolution";
import KeyFeatures from "@/components/KeyFeatures";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSolution />
      <KeyFeatures />
      <Footer />
    </main>
  );
};

export default Index;
