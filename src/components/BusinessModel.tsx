import { CheckCircle } from "lucide-react";
import roiImage from "@/assets/roi-infographic.jpg";

const benefits = [
  "0.5-1% transparent transaction fees",
  "Premium features for power users",
  "DeFi yield sharing for passive income",
  "Referral bonuses for growing the network",
];

const BusinessModel = () => {
  return (
    <section id="benefits" className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Business Model
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-accent">GigChain Pay</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A sustainable model that benefits both users and the platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Revenue & Benefits</h3>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl p-6 border border-border text-center shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-accent mb-1">$25+</p>
                <p className="text-sm text-muted-foreground">Monthly User Savings</p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border text-center shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-primary mb-1">10K</p>
                <p className="text-sm text-muted-foreground">Target Users Y1</p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border text-center shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-accent mb-1">$408K</p>
                <p className="text-sm text-muted-foreground">Projected Annual Revenue</p>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-lg">
              <img 
                src={roiImage} 
                alt="ROI and growth projections infographic" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground rounded-xl px-6 py-3 shadow-lg">
              <p className="text-sm font-semibold">4-8% APY on Holdings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessModel;
