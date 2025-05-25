"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { RegistrationFlow } from "../../components/auth/RegistrationFlow";
import { PlanType } from "../../components/auth/PlanTypes";
import { Suspense } from "react";

// Client component that uses searchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignUp = searchParams.get("signup") === "true";
  const selectedPlan = searchParams.get("plan") as PlanType | null;
  const { signIn } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Link href="/" className="absolute top-4 left-4 text-purple-600 hover:underline flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600">KidSafe YouTube</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>
        
        <Card className="shadow-lg border-purple-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              {isSignUp ? "Sign Up" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? "Create an account to start protecting your children's YouTube experience" 
                : "Sign in to access your KidSafe YouTube dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationFlow 
              isSignUp={isSignUp} 
              selectedPlan={selectedPlan} 
              signIn={signIn}
            />
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          {isSignUp ? (
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Sign in
              </Link>
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link href="/login?signup=true" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
