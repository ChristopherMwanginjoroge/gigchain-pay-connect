import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpenText, CheckCircle2, Coins, Globe2, Rocket, Sparkles, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/landing/Reveal";

const GigChainSchool = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
    toast.success("You're on the waitlist! We'll notify you when GigChain School launches.");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 pt-20 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-20 h-[35rem] w-[35rem] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 h-[25rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-[100px]" />
        </div>

        <div className="container relative pb-16 pt-12 sm:pb-20 sm:pt-16">
          <Link
            to="/"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-cyan-100 transition-colors hover:text-cyan-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>

          <Reveal className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Coming Soon
            </div>

            <h1 className="font-display mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
              <span className="text-white">Welcome to</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                GigChain School
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Learn. Earn. Build your future. A gamified educational platform where you master digital finance skills
              and earn real USDC rewards along the way.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#waitlist"
                className="group inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-8 py-4 text-lg font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition-all hover:bg-cyan-200"
              >
                Join the Waitlist
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>

          {/* Feature Stats */}
          <Reveal delay={200}>
            <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
              {[
                { icon: Users, value: "500+", label: "Early Signups" },
                { icon: Coins, value: "$1000+", label: "USDC Rewards Pool" },
                { icon: Globe2, value: "10+", label: "Countries Ready" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10"
                >
                  <stat.icon className="mb-3 h-8 w-8 text-cyan-300" />
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Wave divider */}
        <div className="relative h-16">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 C150,100 350,100 600,50 C850,0 1050,0 1200,50 L1200,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container">
          <Reveal className="mb-12 text-center">
            <span className="inline-block rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-semibold text-cyan-900">
              How it works
            </span>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Your journey to digital finance mastery
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              A structured learning path that rewards your progress with real cryptocurrency
            </p>
          </Reveal>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  icon: BookOpenText,
                  step: "01",
                  title: "Learn the Fundamentals",
                  description:
                    "Master digital money basics, blockchain concepts, and cross-border payments through bite-sized interactive lessons.",
                  color: "cyan",
                },
                {
                  icon: Trophy,
                  step: "02",
                  title: "Track Your Progress",
                  description:
                    "Build daily streaks, unlock achievements, and climb leaderboards. Every lesson completed brings you closer to rewards.",
                  color: "blue",
                },
                {
                  icon: Coins,
                  step: "03",
                  title: "Earn Real USDC",
                  description:
                    "Complete milestones and quizzes to earn micro-USDC rewards directly to your GigChain wallet. Learning pays off.",
                  color: "purple",
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <Card className="relative overflow-hidden border-slate-200 p-8 transition-all hover:shadow-xl">
                    <div className="mb-6 flex items-center justify-between">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${item.color}-100`}>
                        <item.icon className={`h-7 w-7 text-${item.color}-600`} />
                      </div>
                      <span className={`text-6xl font-bold text-${item.color}-100`}>{item.step}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-950">{item.title}</h3>
                    <p className="leading-7 text-slate-600">{item.description}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container">
          <Reveal className="mb-12 text-center">
            <span className="inline-block rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-semibold text-cyan-900">
              Coming Soon
            </span>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              What you'll learn
            </h2>
          </Reveal>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
              {[
                { title: "Digital Money 101", lessons: 8, duration: "~2 hours", reward: "5 USDC" },
                { title: "Blockchain Basics", lessons: 12, duration: "~3 hours", reward: "10 USDC" },
                { title: "Cross-Border Payments", lessons: 10, duration: "~2.5 hours", reward: "8 USDC" },
                { title: "DeFi Fundamentals", lessons: 15, duration: "~4 hours", reward: "15 USDC" },
                { title: "Security & Best Practices", lessons: 10, duration: "~2.5 hours", reward: "10 USDC" },
              ].map((module, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-cyan-300 hover:shadow-lg">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-950">{module.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                          <span>{module.lessons} lessons</span>
                          <span>•</span>
                          <span>{module.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                          +{module.reward}
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-cyan-600" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 py-20 text-white sm:py-24">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl">
            {!isSubmitted ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12">
                <div className="mb-8 text-center">
                  <Rocket className="mx-auto mb-4 h-12 w-12 text-cyan-300" />
                  <h2 className="font-display mb-4 text-3xl font-bold sm:text-4xl">Join the Waitlist</h2>
                  <p className="text-lg text-slate-300">
                    Be among the first to access GigChain School and start earning while learning
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-200">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-xl bg-cyan-300 text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-200 disabled:opacity-50"
                  >
                    {isSubmitting ? "Joining..." : "Secure My Spot"}
                  </Button>

                  <p className="text-center text-xs text-slate-400">
                    Early members get exclusive bonuses and priority access to beta features
                  </p>
                </form>
              </div>
            ) : (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center backdrop-blur-xl sm:p-12">
                <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-400" />
                <h2 className="font-display mb-4 text-3xl font-bold">You're On the List! 🎉</h2>
                <p className="mb-6 text-lg text-slate-300">
                  Thanks for joining, {name}! We'll send updates to <span className="font-semibold text-cyan-300">{email}</span>
                </p>
                <p className="text-sm text-slate-400">Check your inbox for a confirmation email</p>
              </div>
            )}
          </Reveal>

          {/* Benefits */}
          <Reveal delay={150}>
            <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
              {[
                { title: "Early Access", description: "Be first to try new features" },
                { title: "Bonus Rewards", description: "Extra USDC for early members" },
                { title: "Beta Community", description: "Shape the future of the platform" },
              ].map((benefit, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                  <p className="mb-2 font-semibold text-white">{benefit.title}</p>
                  <p className="text-sm text-slate-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GigChainSchool;
