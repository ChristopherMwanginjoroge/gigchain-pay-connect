import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Shield, FileText, Twitter, Github, Linkedin, Slack } from "lucide-react";

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
    <footer className="bg-primary text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* CTA / Newsletter Section - Modern Premium */}
      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <h2 className="text-[34px] md:text-[46px] font-bold mb-6 tracking-tight leading-[1.1]">
              Engineered for the <br />
              <span className="text-accent underline decoration-accent/30 underline-offset-8">Global Frontier.</span>
            </h2>
            <p className="text-white/60 text-[16px] font-medium max-w-lg">
              Join 2,400+ developers and companies building the future of cross-border settlements.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 group focus-within:border-white/40 transition-colors">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-transparent border-0 rounded-xl font-medium placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
                    required
                  />
                </div>
                <Button type="submit" className="h-14 rounded-xl bg-white text-primary hover:bg-white/90 px-8 font-bold shadow-lg shadow-white/10">
                  Join Beta Access
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            ) : (
              <div className="bg-white/10 border border-white/20 p-8 rounded-2xl animate-fade-in">
                <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">ACCESS_PENDING</p>
                <p className="text-white font-bold text-[16px] italic">Welcome to the priority list.</p>
              </div>
            )}

            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">
                <Shield className="w-4 h-4" />
                <span>Bank-Grade Integrity</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">
                <FileText className="w-4 h-4" />
                <span>Circle Regulated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand & Links */}
        <div className="mt-24 pt-16 border-t border-white/5 grid md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl">
                <span className="text-primary font-bold text-[17px]">GP</span>
              </div>
              <span className="text-[22px] font-bold tracking-tight">GigPay</span>
            </div>
            <p className="text-white/40 text-[12px] font-medium leading-relaxed max-w-xs mb-8">
              The high-performance settlement layer for the global economy. Built on the integrity of the Hedera network.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-5 h-5 text-white/60" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Github className="w-5 h-5 text-white/60" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="w-5 h-5 text-white/60" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Slack className="w-5 h-5 text-white/60" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[9px]">Protocol</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Liquidity Pool</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Network Status</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Hedera Token Svc</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Governance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[9px]">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Documentation</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Integrations</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Security Audit</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Ecosystem</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[9px]">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">About</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Terms</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Privacy</a></li>
              <li><a href="#" className="text-white/40 hover:text-white transition-colors text-[12px] font-medium">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pb-12 border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/20 text-[11px] font-medium tracking-tight">
            © 2026 GIGPAY NETWORK. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">HEDERA_ECOSYSTEM</span>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">USDC_COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
