import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useKycQuery } from "@/lib/api/kyc";

const OnboardingGate = () => {
  const location = useLocation();
  const kycQuery = useKycQuery();
  const hasKycSubmission = !!kycQuery.data?.length;
  const isKycRoute = location.pathname.startsWith("/app/kyc");

  if (kycQuery.isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-sm text-cyan-100/70">Checking onboarding status...</p>
      </div>
    );
  }

  if (!hasKycSubmission && !isKycRoute) {
    return <Navigate to="/app/kyc" replace />;
  }

  return <Outlet />;
};

export default OnboardingGate;
