import { useState, useEffect, useRef } from "react";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Send, DollarSign, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

const realWorldExample = {
  scenario: "Freelancer receives $1,000 gig payment",
  traditional: {
    steps: [
      { action: "Receive $1,000 payment", cost: "$50-150 (5-15%)", total: "$50-150" },
      { action: "Hold funds (no yield)", cost: "$0 earned", total: "$50-150" },
      { action: "Send $500 payout", cost: "$35-75 (7-15%)", total: "$85-225" },
      { action: "Withdraw $500 to M-Pesa", cost: "$15-40 (3-8%)", total: "$100-265" }
    ],
    totalCost: "$100-265",
    timeToSettle: "7-14 days"
  },
  gigpay: {
    steps: [
      { action: "Receive $1,000 USDC", cost: "$0 (sender pays $0.0001)", total: "$0" },
      { action: "Hold & earn yield (4-8% APY)", cost: "$40-80/year earned", total: "-$40-80" },
      { action: "Send $500 payout", cost: "$2.50-5 (0.5-1% + $0.0001)", total: "$2.50-5" },
      { action: "Withdraw $500 to M-Pesa", cost: "$7.50-20 (1.5-4%)", total: "$10-25" }
    ],
    totalCost: "$10-25",
    timeToSettle: "3-5 seconds + off-ramp time"
  }
};

const costCategories = [
  {
    icon: Wallet,
    title: "Wallet Creation & Setup",
    gigpay: {
      cost: "$0",
      details: [
        "Creating Hedera/Solana wallet: $0 (client-side, no fees)",
        "USDC token association (Hedera): ~$0.0001 (network fee, one-time)",
        "Private key storage/recovery: $0",
        "KYC verification: $0 to user (we absorb ~$1-2 cost)",
        "Total setup: $0"
      ]
    },
    traditional: {
      cost: "$0-50+",
      details: [
        "Account setup fees: $0-25",
        "Verification delays: 1-5 days",
        "Monthly maintenance fees: $0-10",
        "Hidden activation costs: $0-15"
      ]
    }
  },
  {
    icon: ArrowDownCircle,
    title: "Receiving USDC (Incoming Payments)",
    gigpay: {
      cost: "$0",
      details: [
        "On-chain transfer fee: $0.0001 (Hedera) or $0.00025 (Solana)",
        "Fee paid by sender, not receiver",
        "No receiving fee from GigPay",
        "Total cost to receive: $0"
      ]
    },
    traditional: {
      cost: "2-5%",
      details: [
        "Platform receiving fee: 2-5%",
        "Currency conversion spread: 1-3%",
        "Processing delays: 3-7 days",
        "Weekend/holiday holds: additional delays"
      ]
    }
  },
  {
    icon: ArrowUpCircle,
    title: "Depositing Fiat → USDC (On-Ramp)",
    gigpay: {
      cost: "0-3%",
      details: [
        "Coinbase CDP: 0-1.5% (often 0% with promos)",
        "Transak (M-Pesa/card): 1-3% + payment method fee",
        "Yellow Card/Paychant: 1-2.5% spread + M-Pesa fee",
        "On-chain deposit: $0.0001-$0.001",
        "Typical total: 0-3% (aim for <2% with best provider)"
      ]
    },
    traditional: {
      cost: "3-8%",
      details: [
        "Bank transfer fees: 1-3%",
        "Currency conversion: 2-5%",
        "Platform deposit fees: 0.5-2%",
        "Processing delays: 1-3 business days"
      ]
    }
  },
  {
    icon: Send,
    title: "Sending USDC (Payouts)",
    gigpay: {
      cost: "0.5-1% + $0.0001-$0.00025",
      details: [
        "On-chain transfer: $0.0001 (Hedera) or $0.00025 (Solana)",
        "GigPay platform fee: 0.5-1% (configurable)",
        "Total cost: 0.5-1% + minimal network fee",
        "Settlement: 3-5 seconds"
      ]
    },
    traditional: {
      cost: "7-15%",
      details: [
        "Platform fee: 3-7%",
        "Currency conversion: 2-5%",
        "Processing fee: 1-2%",
        "Settlement: 3-7 days (weekends blocked)"
      ]
    }
  },
  {
    icon: DollarSign,
    title: "Withdrawing USDC → Fiat (Off-Ramp)",
    gigpay: {
      cost: "1.5-4%",
      details: [
        "Transak/Yellow Card/Paychant: 1-3% spread + M-Pesa fee (~0.5-1%)",
        "Coinbase Offramp: 0-2% (promo-dependent)",
        "On-chain fee: $0.0001-$0.001",
        "Typical total: 1.5-4% (aim for <3% with best provider)"
      ]
    },
    traditional: {
      cost: "3-8%",
      details: [
        "Withdrawal fee: 1-3%",
        "Currency conversion: 2-5%",
        "Bank transfer fee: 0.5-1%",
        "Processing: 1-3 business days"
      ]
    }
  },
  {
    icon: TrendingUp,
    title: "Other Costs",
    gigpay: {
      cost: "$0 (or optional)",
      details: [
        "Yield earning: $0 (you get 4-8% APY, we take 20-30% skim)",
        "Premium subscription: $5-20/month (optional, future feature)",
        "Recovery file storage: $0 (local device)",
        "No hidden fees, no monthly charges"
      ]
    },
    traditional: {
      cost: "Ongoing",
      details: [
        "Monthly account fees: $5-20",
        "Idle balance fees: 0.5-1%",
        "No yield on balances",
        "Premium features: $10-50/month"
      ]
    }
  }
];

const ProblemSolution = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative py-16 lg:py-20 bg-white overflow-hidden -mt-px"
    >
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/2 rounded-full blur-[80px] -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/2 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3" />

      <div className="container relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 pt-4">
          <h2 className="text-[36px] md:text-[56px] lg:text-[68px] font-black text-primary tracking-tighter mb-6">
            How GigPay <span className="text-accent italic">Actually Works</span>
            </h2>
          <p className="text-primary/60 text-[16px] md:text-[18px] lg:text-[19px] max-w-4xl mx-auto font-medium leading-relaxed">
            Every cost, every step, every advantage. No hidden fees, no surprises—just transparent pricing that saves you 85%+ compared to traditional payment platforms. See exactly what you pay for wallet setup, receiving payments, deposits, payouts, withdrawals, and optional features.
          </p>
        </div>

        {/* Cost Breakdown Grid */}
        <div className="space-y-8 mb-16">
          {costCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="bg-white rounded-3xl border-2 border-primary/10 p-6 lg:p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-[18px] md:text-[22px] font-black text-primary tracking-tighter">
                    {category.title}
                  </h3>
          </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* GigPay Column */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        <span className="text-[10px] font-black text-accent uppercase tracking-wider">GigPay</span>
                      </div>
                      <span className="text-[20px] font-black text-accent">{category.gigpay.cost}</span>
                </div>
                    <ul className="space-y-2">
                      {category.gigpay.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                          <p className="text-[11px] text-primary/70 font-medium leading-relaxed">{detail}</p>
                        </li>
                      ))}
                    </ul>
              </div>

                  {/* Traditional Column */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-destructive" />
                        <span className="text-[10px] font-black text-destructive uppercase tracking-wider">Traditional</span>
                    </div>
                      <span className="text-[20px] font-black text-destructive">{category.traditional.cost}</span>
                  </div>
                    <ul className="space-y-2">
                      {category.traditional.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                          <p className="text-[11px] text-primary/70 font-medium leading-relaxed">{detail}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
              </div>
                </div>
            );
          })}
        </div>

        {/* Real-World Example */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 p-5 lg:p-6">
          <div className="text-center mb-5">
            <h3 className="text-[20px] md:text-[26px] font-black text-primary tracking-tighter mb-1.5">
              Real-World Example: $1,000 Gig Payment
            </h3>
            <p className="text-primary/60 text-[11px] md:text-[12px] font-medium">
              See the actual cost difference for a typical freelancer workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-5">
            {/* Traditional Flow */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 border-2 border-destructive/20">
              <div className="flex items-center gap-2 mb-2.5">
                <XCircle className="w-4 h-4 text-destructive" />
                <h4 className="text-[12px] font-black text-destructive uppercase tracking-wider">Traditional Platform</h4>
              </div>
              <div className="space-y-1.5 mb-2.5">
                {realWorldExample.traditional.steps.map((step, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 p-1.5 bg-destructive/5 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black text-primary/60 uppercase tracking-wider mb-0.5 truncate">{step.action}</p>
                      <p className="text-[9px] text-primary/80 font-medium">{step.cost}</p>
                    </div>
                    <span className="text-[10px] font-black text-destructive shrink-0 ml-2">{step.total}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2.5 border-t-2 border-destructive/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider">Total Cost</span>
                  <span className="text-[18px] font-black text-destructive">{realWorldExample.traditional.totalCost}</span>
                </div>
                <p className="text-[8px] text-primary/60 font-medium">Settlement: {realWorldExample.traditional.timeToSettle}</p>
              </div>
            </div>

            {/* GigPay Flow */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 border-2 border-accent/30">
              <div className="flex items-center gap-2 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <h4 className="text-[12px] font-black text-accent uppercase tracking-wider">GigPay</h4>
              </div>
              <div className="space-y-1.5 mb-2.5">
                {realWorldExample.gigpay.steps.map((step, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 p-1.5 bg-accent/5 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-black text-primary/60 uppercase tracking-wider mb-0.5 truncate">{step.action}</p>
                      <p className="text-[9px] text-primary/80 font-medium">{step.cost}</p>
                    </div>
                    <span className="text-[10px] font-black text-accent shrink-0 ml-2">{step.total}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2.5 border-t-2 border-accent/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider">Total Cost</span>
                  <span className="text-[18px] font-black text-accent">{realWorldExample.gigpay.totalCost}</span>
                </div>
                <p className="text-[8px] text-primary/60 font-medium">Settlement: {realWorldExample.gigpay.timeToSettle}</p>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="bg-primary rounded-2xl p-4 text-center">
            <p className="text-[10px] font-black text-white/80 uppercase tracking-wider mb-1">You Save</p>
            <p className="text-[30px] md:text-[36px] font-black text-white mb-1">
              {(() => {
                const traditionalMin = 100;
                const traditionalMax = 265;
                const gigpayMin = 10;
                const gigpayMax = 25;
                const savingsMin = traditionalMin - gigpayMax;
                const savingsMax = traditionalMax - gigpayMin;
                return `$${savingsMin}-${savingsMax}`;
              })()}
            </p>
            <p className="text-[11px] font-black text-white/80 uppercase tracking-wider">
              Plus instant settlement + yield earning
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
