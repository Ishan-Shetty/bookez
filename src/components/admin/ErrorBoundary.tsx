"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert"; 

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function TRPCErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Caught error:", error);
      // Fix the unsafe argument type with proper type casting
      setError(error.error instanceof Error ? error.error : new Error(String(error.error)));
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return fallback ?? (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>
          {error?.message ?? "An unexpected error occurred while fetching data. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

export default TRPCErrorBoundary;
