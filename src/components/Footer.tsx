import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Shield, FileText } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Section */}
      <div className="container py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Earn More from Your Global Gigs?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join the beta and be among the first to experience seamless, low-cost international payments.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-primary-foreground text-foreground border-0 rounded-xl"
                  required
                />
              </div>
              <Button type="submit" variant="hero" size="xl" className="rounded-xl">
                Join the Beta
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          ) : (
            <div className="bg-accent/20 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-accent font-semibold">🎉 You're on the list!</p>
              <p className="text-primary-foreground/80 text-sm mt-1">We'll notify you when beta access opens.</p>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-10 border-t border-primary-foreground/20">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <FileText className="w-5 h-5" />
              <span className="text-sm">Regulated USDC</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <div className="w-5 h-5 rounded bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">H</div>
              <span className="text-sm">Powered by Hedera</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">GC</span>
              </div>
              <span className="font-bold text-xl">GigChain Pay</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Terms of Service</a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</a>
              <a href="mailto:hello@gigchainpay.com" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">hello@gigchainpay.com</a>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="mt-8 pt-6 border-t border-primary-foreground/10">
            <p className="text-primary-foreground/50 text-xs text-center leading-relaxed max-w-3xl mx-auto">
              <strong>Disclaimer:</strong> GigChain Pay is currently in testnet phase. USDC is a regulated stablecoin issued by Circle. 
              Cryptocurrency transactions carry inherent risks. Past performance does not guarantee future results. 
              Yield rates are variable and subject to market conditions. Always do your own research before using any financial service.
            </p>
          </div>

          <p className="text-primary-foreground/50 text-xs text-center mt-6">
            © 2025 GigChain Pay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
