import { useState, useEffect, useRef } from "react";
import { Unlock, Zap, Smartphone, Wallet, ArrowDownCircle, ArrowUpCircle, Send, DollarSign, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

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
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const costsRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.15 }
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

  // Separate effect for card observers - runs after refs are set
  useEffect(() => {
    const cardObservers: IntersectionObserver[] = [];

    // Small delay to ensure refs are set
    const timeoutId = setTimeout(() => {
      cardRefs.current.forEach((ref, index) => {
        if (ref) {
          const cardObserver = new IntersectionObserver(
            ([entry]) => {
              // Trigger animation whenever visible, regardless of scroll direction
              if (entry.isIntersecting) {
                setVisibleCards(prev => new Set(prev).add(index));
              } else {
                // Reset when leaving viewport so it can animate again when scrolling back
                setVisibleCards(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(index);
                  return newSet;
                });
              }
            },
            { 
              threshold: 0.1,
              rootMargin: '0px 0px -50px 0px'
            }
          );
          
          cardObserver.observe(ref);
          cardObservers.push(cardObserver);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cardObservers.forEach(obs => obs.disconnect());
    };
  }, []); // Run once after mount

  return (
    <>
    <section
      id="problem"
      ref={sectionRef}
      className="relative h-screen min-h-[600px] flex items-center bg-white overflow-hidden"
    >
      {/* Decorative background blurs - subtle */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

      <div className="container relative z-10 py-6 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="w-full">
          {/* Centered Heading - Pop-up Animation repeated on scroll */}
          <div className={`text-center mb-6 md:mb-8 lg:mb-12 transition-all duration-[2500ms] ${isVisible ? "animate-in fade-in zoom-in slide-in-from-bottom-8 opacity-100" : "opacity-0"
            }`}>
            <h2 className="text-[24px] sm:text-[28px] md:text-[42px] lg:text-[56px] font-black text-primary tracking-tighter">
              The Reality of <span className="text-accent italic font-black">Global Money.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-12 items-start max-w-6xl mx-auto">
            {/* The Problem - Left-Fade Animation repeated on scroll */}
            <div className={`space-y-3 md:space-y-4 transition-all duration-[2500ms] ${isVisible ? "animate-in fade-in slide-in-from-left-12 opacity-100" : "opacity-0"
              }`}>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-destructive font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  The Old Way
                </div>
                <h3 className="text-[18px] md:text-[20px] lg:text-[24px] font-black text-primary tracking-tighter leading-tight">Remitly / Wise / PayPal</h3>
              </div>

              <div className="grid gap-1.5 md:gap-2">
                {[
                  { text: "3-7% total fees", detail: "Transfer + FX + hidden spreads" },
                  { text: "1-3 days settlement", detail: "Express still takes 1 day" },
                  { text: "FX volatility risk", detail: "KES depreciation during transfer" },
                  { text: "Custodial accounts", detail: "Company can freeze funds" },
                  { text: "Complex receiving", detail: "Email, account numbers required" },
                  { text: "Zero yield on balances", detail: "Money sits idle earning nothing" },
                  { text: "Single payment rail", detail: "Locked to one provider" },
                  { text: "Built for remittances", detail: "Not designed for gig workers" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2 md:p-2.5 bg-black/5 rounded-xl border border-black/5 group hover:bg-black/[0.07] transition-all duration-300 ${isVisible ? "animate-in fade-in slide-in-from-left-8 opacity-100" : "opacity-0"
                      } fill-mode-both`}
                    style={{
                      animationDelay: isVisible ? `${(i + 1) * 250}ms` : "0ms",
                      animationDuration: '1800ms'
                    }}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                      <span className="text-primary/90 text-[11px] md:text-[12px] font-black uppercase tracking-wider truncate">{item.text}</span>
                    </div>
                    <span className="text-primary/30 text-[8px] md:text-[9px] font-black uppercase tracking-widest hidden lg:block ml-2">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Solution - Staggered Fade Up repeated on scroll */}
            <div className={`space-y-3 md:space-y-4 transition-all duration-[2500ms] ${isVisible ? "animate-in fade-in slide-in-from-right-12 opacity-100" : "opacity-0"
              }`}>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-accent font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em]">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  The GigPay Way
                </div>
                <h3 className="text-[18px] md:text-[20px] lg:text-[24px] font-black text-primary tracking-tighter leading-tight">True Financial Freedom.</h3>
              </div>

              <div className="grid gap-2 md:gap-2.5">
                {[
                  { 
                    icon: Zap, 
                    title: "Near-Zero Fees", 
                    detail: "Under 2% end-to-end, keep 98-99% of earnings",
                    highlight: true
                  },
                  { 
                    icon: Unlock, 
                    title: "Instant Settlement", 
                    detail: "0.4-5 seconds finality, same-day payouts",
                    highlight: false
                  },
                  { 
                    icon: Smartphone, 
                    title: "USDC Stability", 
                    detail: "No FX volatility, earned dollars stay dollars",
                    highlight: false
                  },
                  { 
                    icon: Unlock, 
                    title: "Non-Custodial", 
                    detail: "You own keys, no freezes, full sovereignty",
                    highlight: false
                  },
                  { 
                    icon: Smartphone, 
                    title: "Phone Number = Wallet", 
                    detail: "Share phone, receive instantly, ultra-simple",
                    highlight: false
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Built-in Yield", 
                    detail: "4-8% APY on idle USDC automatically",
                    highlight: false
                  },
                  { 
                    icon: Zap, 
                    title: "Multi-Chain Choice", 
                    detail: "Hedera (low fees) + Solana (speed)",
                    highlight: false
                  },
                  { 
                    icon: Smartphone, 
                    title: "Gig-Specific Design", 
                    detail: "Invoices, escrow, fraud detection built-in",
                    highlight: false
                  }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 md:gap-3 p-2.5 md:p-3 ${item.highlight ? 'bg-primary' : 'bg-white'} rounded-xl md:rounded-2xl border ${item.highlight ? 'border-primary' : 'border-border'} ${item.highlight ? 'shadow-xl' : 'shadow-sm'} hover:scale-[1.01] transition-all cursor-default group ${isVisible ? "animate-in fade-in slide-in-from-bottom-4 opacity-100" : "opacity-0"
                        } duration-[2000ms] fill-mode-both`}
                      style={{ animationDelay: isVisible ? `${(i + 1) * 250}ms` : "0ms" }}
                    >
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${item.highlight ? 'bg-white/10' : 'bg-primary/5'} flex items-center justify-center shrink-0 ${!item.highlight && 'group-hover:bg-primary/10'} transition-colors`}>
                        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${item.highlight ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`${item.highlight ? 'text-white' : 'text-primary'} font-black text-[11px] md:text-[12px] uppercase tracking-wider`}>{item.title}</h4>
                        <p className={`${item.highlight ? 'text-white/40' : 'text-primary/40'} text-[8px] md:text-[9px] font-black uppercase tracking-widest leading-tight mt-0.5`}>{item.detail}</p>
                      </div>
                  </div>
                  );
                })}
                  </div>
                </div>
                  </div>
                  </div>
                </div>
    </section>

    {/* Cost Breakdown Section */}
    <section
      ref={costsRef}
      className="relative py-8 md:py-12 lg:py-16 bg-white overflow-hidden -mt-px"
    >
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/2 rounded-full blur-[80px] -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/2 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3" />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10 pt-2">
          <h2 className="text-[24px] sm:text-[28px] md:text-[42px] lg:text-[52px] font-black text-primary tracking-tighter mb-3 md:mb-4">
            How GigPay <span className="text-accent italic">Actually Works</span>
          </h2>
          <p className="text-primary/60 text-[13px] md:text-[14px] lg:text-[17px] max-w-4xl mx-auto font-medium leading-relaxed px-2">
            Every cost, every step, every advantage. No hidden fees, no surprises—just transparent pricing that saves you 85%+ compared to traditional payment platforms. See exactly what you pay for wallet setup, receiving payments, deposits, payouts, withdrawals, and optional features.
          </p>
        </div>

        {/* Cost Breakdown Grid - Alternating Slide Animations */}
        <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
          {costCategories.map((category, index) => {
            const Icon = category.icon;
            // Alternate starting from right: even indices (0,2,4) slide from right, odd (1,3,5) from left
            const slideFrom = index % 2 === 0 ? 'right' : 'left';
            const isVisible = visibleCards.has(index);
            return (
              <div
                key={category.title}
                ref={(el) => {
                  if (el) {
                    cardRefs.current[index] = el;
                  }
                }}
                className={`bg-white rounded-xl md:rounded-2xl border-2 border-primary/10 p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all ${
                  visibleCards.has(index)
                    ? slideFrom === 'right' 
                      ? "animate-in fade-in slide-in-from-right-12 opacity-100" 
                      : "animate-in fade-in slide-in-from-left-12 opacity-100"
                    : "opacity-0"
                }`}
                style={{
                  animationDuration: '1200ms'
                }}
              >
                <div className="flex items-center gap-2 md:gap-2.5 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <h3 className="text-[14px] md:text-[16px] lg:text-[18px] font-black text-primary tracking-tighter">
                    {category.title}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  {/* GigPay Column */}
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center justify-between mb-1.5 md:mb-2">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent shrink-0" />
                        <span className="text-[8px] md:text-[9px] font-black text-accent uppercase tracking-wider">GigPay</span>
                      </div>
                      <span className="text-[14px] md:text-[16px] font-black text-accent">{category.gigpay.cost}</span>
                    </div>
                    <ul className="space-y-1 md:space-y-1.5">
                      {category.gigpay.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-1 md:gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-accent mt-1 md:mt-1.5 shrink-0" />
                          <p className="text-[9px] md:text-[10px] text-primary/70 font-medium leading-relaxed">{detail}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Traditional Column */}
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center justify-between mb-1.5 md:mb-2">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-destructive shrink-0" />
                        <span className="text-[8px] md:text-[9px] font-black text-destructive uppercase tracking-wider">Traditional</span>
                      </div>
                      <span className="text-[14px] md:text-[16px] font-black text-destructive">{category.traditional.cost}</span>
                    </div>
                    <ul className="space-y-1 md:space-y-1.5">
                      {category.traditional.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-1 md:gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-destructive mt-1 md:mt-1.5 shrink-0" />
                          <p className="text-[9px] md:text-[10px] text-primary/70 font-medium leading-relaxed">{detail}</p>
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
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl md:rounded-3xl border-2 border-primary/20 p-4 md:p-5 lg:p-6">
          <div className="text-center mb-4 md:mb-5">
            <h3 className="text-[18px] md:text-[20px] lg:text-[26px] font-black text-primary tracking-tighter mb-1 md:mb-1.5">
              Real-World Example: $1,000 Gig Payment
            </h3>
            <p className="text-primary/60 text-[10px] md:text-[11px] lg:text-[12px] font-medium px-2">
              See the actual cost difference for a typical freelancer workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-5">
            {/* Traditional Flow */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-3.5 border-2 border-destructive/20">
              <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-2.5">
                <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-destructive shrink-0" />
                <h4 className="text-[11px] md:text-[12px] font-black text-destructive uppercase tracking-wider">Traditional Platform</h4>
              </div>
              <div className="space-y-1 md:space-y-1.5 mb-2 md:mb-2.5">
                {[
                  { action: "Receive $1,000 payment", cost: "$50-150 (5-15%)", total: "$50-150" },
                  { action: "Hold funds (no benefits)", cost: "$0 earned", total: "$50-150" },
                  { action: "Send $500 payout", cost: "$35-75 (7-15%)", total: "$85-225" },
                  { action: "Withdraw $500 to M-Pesa", cost: "$15-40 (3-8%)", total: "$100-265" }
                ].map((step, i) => (
                  <div key={i} className="flex items-start justify-between gap-1.5 md:gap-2 p-1 md:p-1.5 bg-destructive/5 rounded-md md:rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-[7px] md:text-[8px] font-black text-primary/60 uppercase tracking-wider mb-0.5 truncate">{step.action}</p>
                      <p className="text-[8px] md:text-[9px] text-primary/80 font-medium">{step.cost}</p>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-destructive shrink-0 ml-1 md:ml-2">{step.total}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 md:pt-2.5 border-t-2 border-destructive/20">
                <div className="flex items-center justify-between mb-0.5 md:mb-1">
                  <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-wider">Total Cost</span>
                  <span className="text-[16px] md:text-[18px] font-black text-destructive">$100-265</span>
                </div>
                <p className="text-[7px] md:text-[8px] text-primary/60 font-medium">Settlement: 7-14 days</p>
              </div>
            </div>

            {/* GigPay Flow */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-3.5 border-2 border-accent/30">
              <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent shrink-0" />
                <h4 className="text-[11px] md:text-[12px] font-black text-accent uppercase tracking-wider">GigPay</h4>
              </div>
              <div className="space-y-1 md:space-y-1.5 mb-2 md:mb-2.5">
                {[
                  { action: "Receive $1,000 USDC", cost: "$0 (sender pays $0.0001)", total: "$0" },
                  { action: "Hold with full control", cost: "No freezes, instant access", total: "$0" },
                  { action: "Send $500 payout", cost: "$2.50-5 (0.5-1% + $0.0001)", total: "$2.50-5" },
                  { action: "Withdraw $500 to M-Pesa", cost: "$7.50-20 (1.5-4%)", total: "$10-25" }
                ].map((step, i) => (
                  <div key={i} className="flex items-start justify-between gap-1.5 md:gap-2 p-1 md:p-1.5 bg-accent/5 rounded-md md:rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-[7px] md:text-[8px] font-black text-primary/60 uppercase tracking-wider mb-0.5 truncate">{step.action}</p>
                      <p className="text-[8px] md:text-[9px] text-primary/80 font-medium">{step.cost}</p>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-accent shrink-0 ml-1 md:ml-2">{step.total}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 md:pt-2.5 border-t-2 border-accent/30">
                <div className="flex items-center justify-between mb-0.5 md:mb-1">
                  <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-wider">Total Cost</span>
                  <span className="text-[16px] md:text-[18px] font-black text-accent">$10-25</span>
                </div>
                <p className="text-[7px] md:text-[8px] text-primary/60 font-medium">Settlement: 3-5 seconds + off-ramp time</p>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="bg-primary rounded-xl md:rounded-2xl p-3 md:p-4 text-center">
            <p className="text-[9px] md:text-[10px] font-black text-white/80 uppercase tracking-wider mb-0.5 md:mb-1">You Save</p>
            <p className="text-[26px] md:text-[30px] lg:text-[36px] font-black text-white mb-0.5 md:mb-1">
              $75-255
            </p>
            <p className="text-[10px] md:text-[11px] font-black text-white/80 uppercase tracking-wider">
              Plus instant settlement + full control
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ProblemSolution;
