import { AlertTriangle, CheckCircle, ArrowRight, Zap } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section id="problem" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            The Challenge
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The Gig Economy Challenge{" "}
            <span className="text-accent">Solved</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Traditional payment methods are costing freelancers too much. We're changing that.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Problem Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-destructive/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
            <div className="relative bg-card border border-destructive/20 rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">The Problem</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm font-bold">×</span>
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">7-15% Lost in Fees</p>
                    <p className="text-muted-foreground text-sm">PayPal, banks, and M-Pesa chains eat into every payment</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm font-bold">×</span>
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">3-5 Day Delays</p>
                    <p className="text-muted-foreground text-sm">International transfers take too long to clear</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm font-bold">×</span>
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Multiple Dependencies</p>
                    <p className="text-muted-foreground text-sm">Reliance on intermediaries increases risk and cost</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
            <div className="relative bg-card border border-accent/20 rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">The Solution</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-accent" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Under 2% Total Fees</p>
                    <p className="text-muted-foreground text-sm">Transparent, low-cost transfers via Hedera blockchain</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-accent" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Instant Settlements</p>
                    <p className="text-muted-foreground text-sm">Receive payments in 3-5 seconds, not days</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-accent" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Non-Custodial Wallets</p>
                    <p className="text-muted-foreground text-sm">Phone as ID, you control your funds directly</p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-border flex items-center gap-2 text-accent font-semibold cursor-pointer hover:gap-3 transition-all">
                Learn more about our technology
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
