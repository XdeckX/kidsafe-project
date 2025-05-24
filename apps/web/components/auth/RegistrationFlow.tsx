"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlanType } from "./PlanTypes";
import { AccountForm } from "./AccountForm";
import { PaymentForm } from "./PaymentForm";
import { SuccessMessage } from "./SuccessMessage";

interface RegistrationFlowProps {
  isSignUp: boolean;
  selectedPlan: PlanType | null;
  signIn: (email: string, data?: any) => Promise<{success: boolean; error?: string}>;
}

export function RegistrationFlow({ isSignUp, selectedPlan, signIn }: RegistrationFlowProps) {
  const router = useRouter();

  // Current step in the registration flow
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
  // User information
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  // Payment information
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [billingName, setBillingName] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Active plan
  const [plan, setPlan] = useState<PlanType | null>(null);
  
  // Initialize plan from URL parameter
  useEffect(() => {
    if (isSignUp && selectedPlan && 
        (selectedPlan === "free-trial" || selectedPlan === "single" || selectedPlan === "family")) {
      setPlan(selectedPlan);
    } else {
      setPlan(null);
    }
    
    // Reset to first step when changing modes
    setCurrentStep(1);
    
    // Clear form fields
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setMessage(null);
    setValidationErrors({});
  }, [isSignUp, selectedPlan]);
  
  // Pre-populate billing name when user name changes
  useEffect(() => {
    if (name) {
      setBillingName(name);
    }
  }, [name]);
  
  // Validate account form (step 1)
  const validateAccountForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (isSignUp) {
      if (!name) {
        errors.name = "Name is required";
      }

      if (!password) {
        errors.password = "Password is required";
      } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate payment form (step 2)
  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};
    
    if (!cardNumber) {
      errors.cardNumber = "Card number is required";
    } else {
      const v = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length !== 16) {
        errors.cardNumber = "Card number must be 16 digits";
      }
    }
    
    if (!cardExpiry) {
      errors.cardExpiry = "Expiration date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = "Format must be MM/YY";
    }
    
    if (!cardCvc) {
      errors.cardCvc = "CVC is required";
    } else if (!/^\d{3,4}$/.test(cardCvc)) {
      errors.cardCvc = "CVC must be 3 or 4 digits";
    }
    
    if (!billingName) {
      errors.billingName = "Name on card is required";
    }
    
    if (!billingZip) {
      errors.billingZip = "Zip/postal code is required";
    }
    
    if (!agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission based on current step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    // For login (not signup)
    if (!isSignUp) {
      if (!validateAccountForm()) {
        return;
      }

      setIsLoading(true);

      try {
        // Call our auth context to handle sign-in
        const result = await signIn(email);
        
        if (result.success) {
          setMessage({
            text: "Login successful! Redirecting to dashboard...",
            type: "success"
          });
          
          // For now in our development version, since we're using mock auth,
          // we'll redirect to the parent dashboard immediately
          setTimeout(() => {
            router.push("/parent/dashboard");
          }, 1500);
        } else {
          setMessage({
            text: result.error || "Something went wrong. Please try again.",
            type: "error"
          });
        }
      } catch (error) {
        setMessage({
          text: "An unexpected error occurred. Please try again.",
          type: "error"
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // For signup, handle multi-step form
    if (currentStep === 1) {
      // Validate account information
      if (validateAccountForm()) {
        // If free trial or payment not required, skip to success
        if (plan === "free-trial") {
          setIsLoading(true);
          
          try {
            // Register the user without payment
            const registrationData = {
              name,
              password
            };
            
            const result = await signIn(email, registrationData);
            
            if (result.success) {
              // Show success message and redirect
              setMessage({
                text: "Account created successfully! Redirecting to dashboard...",
                type: "success"
              });
              
              // Store plan information in localStorage for now
              localStorage.setItem('kidsafe_subscription_plan', plan || 'free-trial');
              
              // Move to success step
              setCurrentStep(3);
              
              // Redirect after delay
              setTimeout(() => {
                router.push("/parent/dashboard");
              }, 3000);
            } else {
              setMessage({
                text: result.error || "Something went wrong. Please try again.",
                type: "error"
              });
            }
          } catch (error) {
            setMessage({
              text: "An unexpected error occurred. Please try again.",
              type: "error"
            });
          } finally {
            setIsLoading(false);
          }
        } else {
          // Move to payment step for paid plans
          setCurrentStep(2);
        }
      }
    } else if (currentStep === 2) {
      // Validate payment information
      if (validatePaymentForm()) {
        setIsLoading(true);
        
        try {
          // In a real app, this would be where we'd create a Stripe payment method
          // and pass it to our Supabase backend to handle subscription creation
          
          // For now, we'll simulate a successful payment and registration
          const registrationData = {
            name,
            password
          };
          
          const result = await signIn(email, registrationData);
          
          if (result.success) {
            // Show success message
            setMessage({
              text: "Payment processed and account created successfully!",
              type: "success"
            });
            
            // Store plan information in localStorage for now
            localStorage.setItem('kidsafe_subscription_plan', plan || 'single');
            
            // Move to success step
            setCurrentStep(3);
            
            // Redirect after delay
            setTimeout(() => {
              router.push("/parent/dashboard");
            }, 3000);
          } else {
            setMessage({
              text: result.error || "Something went wrong with the payment. Please try again.",
              type: "error"
            });
          }
        } catch (error) {
          setMessage({
            text: "An unexpected error occurred. Please try again.",
            type: "error"
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message (Step 3) */}
      {currentStep === 3 ? (
        <SuccessMessage plan={plan} />
      ) : (
        <>
          {/* Step 1: Account Form */}
          {currentStep === 1 && (
            <AccountForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              name={name}
              setName={setName}
              validationErrors={validationErrors}
              isSignUp={isSignUp}
            />
          )}
          
          {/* Step 2: Payment Form */}
          {currentStep === 2 && (
            <PaymentForm
              plan={plan}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvc={cardCvc}
              setCardCvc={setCardCvc}
              billingName={billingName}
              setBillingName={setBillingName}
              billingZip={billingZip}
              setBillingZip={setBillingZip}
              agreeToTerms={agreeToTerms}
              setAgreeToTerms={setAgreeToTerms}
              validationErrors={validationErrors}
            />
          )}
          
          {/* Error Message */}
          {message && message.type === "error" && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {message.text}
            </div>
          )}
          
          {/* Success Message */}
          {message && message.type === "success" && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {message.text}
            </div>
          )}
          
          {/* Form Buttons */}
          <div className="pt-2">
            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full mb-3 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Account Details
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors ${
                isLoading 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : !isSignUp ? (
                "Sign In"
              ) : currentStep === 1 ? (
                plan === "free-trial" ? "Start Free Trial" : "Continue to Payment"
              ) : (
                "Complete Subscription"
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
