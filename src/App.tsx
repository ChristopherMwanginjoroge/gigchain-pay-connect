import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "@/pages/AppLayout";
import Dashboard from "@/pages/app/Dashboard";
import Kyc from "@/pages/app/Kyc";
import Activity from "@/pages/app/Activity";
import NewTransaction from "@/pages/app/NewTransaction";
import Invoice from "@/pages/app/Invoice";
import Deposit from "@/pages/app/Deposit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthModalProvider>
            <Routes>
              <Route path="/" element={<Index />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="kyc" element={<Kyc />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="activity" element={<Activity />} />
                  <Route path="deposit" element={<Deposit />} />
                  <Route path="invoice" element={<Invoice />} />
                  <Route path="transactions/new" element={<NewTransaction />} />
                </Route>
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthModalProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
