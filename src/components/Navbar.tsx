import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"
                }`}
        >
            <div className="container max-w-7xl">
                <div className={`
          relative flex items-center justify-between px-6 h-14 
          transition-all duration-500 rounded-xl border
          ${scrolled
                        ? "bg-white/80 backdrop-blur-xl border-accent/40 shadow-md"
                        : "bg-white/40 backdrop-blur-md border-accent/10 shadow-sm"
                    }
        `}>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 flex items-center justify-center overflow-hidden rounded-xl">
                            <img src="/favicon.png" alt="GigPay Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-primary font-bold text-xl tracking-tight">GigPay</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#problem" className="text-primary/60 hover:text-primary transition-colors text-sm font-medium">Why GigPay</a>
                        <a href="#how-it-works" className="text-primary/60 hover:text-primary transition-colors text-sm font-medium">How it works</a>
                        <a href="#features" className="text-primary/60 hover:text-primary transition-colors text-sm font-medium">Network</a>
                    </div>

                    <Button size="sm" className="rounded-xl px-6 bg-primary font-semibold hover:shadow-glow transition-all">
                        Download App
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
