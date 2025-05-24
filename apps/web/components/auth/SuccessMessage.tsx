"use client";

import { PlanType, planDetails } from "./PlanTypes";

interface SuccessMessageProps {
  plan: PlanType | null;
}

export function SuccessMessage({ plan }: SuccessMessageProps) {
  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Welcome to KidSafe YouTube!
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {plan === "free-trial" 
          ? "Your 7-day free trial has been activated."
          : `Your ${plan ? planDetails[plan].name : "subscription"} has been activated.`}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Redirecting you to your dashboard...
      </p>
    </div>
  );
}
