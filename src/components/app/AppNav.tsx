import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowLeftRight, LayoutDashboard, Landmark, QrCode, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";

const linkBase =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors";
const mobileLinkBase = "flex flex-col items-center gap-1 text-[11px] font-semibold";

const links = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/kyc", label: "KYC", icon: ShieldCheck },
  { to: "/app/activity", label: "Activity", icon: ArrowLeftRight },
  { to: "/app/deposit", label: "Deposit", icon: Landmark },
  { to: "/app/invoice", label: "Invoice", icon: QrCode },
  { to: "/app/transactions/new", label: "Transfer", icon: Send },
];

const AppNav = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="container max-w-6xl">
          <div className="app-screen flex h-16 items-center justify-between rounded-2xl px-4">
            <Link to="/app/dashboard" className="flex items-center gap-2 text-base font-bold tracking-tight text-cyan-100">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-200">G</span>
              GigChain Pay
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? "bg-cyan-400/20 text-cyan-100" : "text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-100"}`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <p className="hidden max-w-48 truncate text-xs text-cyan-100/70 md:block">
                {user?.email ?? user?.phone ?? "Signed in"}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-300/35 bg-transparent text-cyan-100 hover:bg-cyan-300/10 hover:text-cyan-50"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <div className="app-screen grid grid-cols-6 rounded-2xl px-2 py-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${mobileLinkBase} rounded-lg py-1 ${isActive ? "text-cyan-100" : "text-slate-300"}`
              }
            >
              <span className={`rounded-full p-2 ${label === "Transfer" ? "bg-cyan-400/20" : "bg-slate-600/20"}`}>
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default AppNav;
