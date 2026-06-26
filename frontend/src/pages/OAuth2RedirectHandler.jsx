import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function OAuth2RedirectHandler() {
  const { fetchOAuthUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleRedirect = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          throw new Error("No authentication token found in redirect URL");
        }
        await fetchOAuthUser(token);
        navigate("/", { replace: true });
      } catch (err) {
        console.error("OAuth2 authentication redirect error:", err);
        setError(err.message || "Failed to authenticate with Google");
      }
    };

    handleRedirect();
  }, [fetchOAuthUser, navigate, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 mb-4 text-red-500 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Authentication Failed
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
          {error}
        </p>
        <button
          onClick={() => navigate("/auth")}
          className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-all"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="relative w-20 h-20 mb-6">
        {/* Modern interactive visual spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-rose-600 border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 animate-pulse">
        Completing Login
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2">
        Setting up your secure session, please wait...
      </p>
    </div>
  );
}
