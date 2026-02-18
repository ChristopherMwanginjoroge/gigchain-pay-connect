import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuthModal } from "@/components/auth/AuthModalProvider";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { openAuthModal } = useAuthModal();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-1.5" : "py-3"
                }`}
        >
            <div className="container max-w-7xl">
                <div className={`
          relative flex items-center justify-between px-5 h-11 
          transition-all duration-500 rounded-xl border
          ${scrolled
                        ? "bg-white/80 backdrop-blur-xl border-accent/40 shadow-md"
                        : "bg-white/40 backdrop-blur-md border-accent/10 shadow-sm"
                    }
        `}>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 flex items-center justify-center overflow-hidden rounded-lg">
                            <img src="/favicon.png" alt="GigPay Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-primary font-bold text-[15px] tracking-tight">GigPay</span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <a href="#problem" className="text-primary/60 hover:text-primary transition-colors text-[11px] font-medium">Why GigPay</a>
                        <a href="#features" className="text-primary/60 hover:text-primary transition-colors text-[11px] font-medium">Network</a>
                        <a href="#benefits" className="text-primary/60 hover:text-primary transition-colors text-[11px] font-medium">Benefits</a>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="rounded-lg px-3 py-1.5 text-[11px] font-semibold h-8">
                            Download App
                        </Button>
                        <Button
                            size="sm"
                            className="rounded-lg px-4 py-1.5 text-[11px] bg-primary font-semibold hover:shadow-glow transition-all h-8"
                            onClick={openAuthModal}
                        >
                            Getting Started
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
