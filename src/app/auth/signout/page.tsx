"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function SignOut() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningOut, setIsSigningOut] = useState(true);
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/";

  useEffect(() => {
    if (isSigningOut) {
      const handleSignOut = async () => {
        try {
          await signOut({ 
            redirect: false,
            callbackUrl: callbackUrl 
          });
          router.push(callbackUrl);
          router.refresh();
        } catch (error) {
          console.error("Sign out error:", error);
          setIsSigningOut(false);
        }
      };

      void handleSignOut();
    }
  }, [callbackUrl, isSigningOut, router]);

  const handleManualSignOut = async () => {
    setIsSigningOut(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {isSigningOut ? (
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Signing out...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Sign out failed</h1>
          <p className="mb-6 text-gray-600">There was a problem signing you out.</p>
          <Button onClick={handleManualSignOut}>Try Again</Button>
        </div>
      )}
    </div>
  );
}
