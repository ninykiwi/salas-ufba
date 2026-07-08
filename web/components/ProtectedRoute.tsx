"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && !allowedRoles.includes(user.role)) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading || !isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="animate-spin text-[#000666]" size={32} />
      </div>
    );
  }

  return <>{children}</>;
}
