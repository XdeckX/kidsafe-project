"use client";

import { useState } from "react";
import { PlanType, planDetails } from "./PlanTypes";

interface PaymentFormProps {
  plan: PlanType | null;
  cardNumber: string;
  setCardNumber: (cardNumber: string) => void;
  cardExpiry: string;
  setCardExpiry: (cardExpiry: string) => void;
  cardCvc: string;
  setCardCvc: (cardCvc: string) => void;
  billingName: string;
  setBillingName: (billingName: string) => void;
  billingZip: string;
  setBillingZip: (billingZip: string) => void;
  agreeToTerms: boolean;
  setAgreeToTerms: (agreeToTerms: boolean) => void;
  validationErrors: Record<string, string>;
}

export function PaymentForm({
  plan,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  billingName,
  setBillingName,
  billingZip,
  setBillingZip,
  agreeToTerms,
  setAgreeToTerms,
  validationErrors
}: PaymentFormProps) {
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format card expiry date
  const formatCardExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    
    return v;
  };

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  // Handle expiry date input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardExpiry(e.target.value);
    setCardExpiry(formattedValue);
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">
            {plan ? planDetails[plan].name : 'Selected Plan'}
          </span>
          <span className="font-medium">
            {plan ? `${planDetails[plan].price}/${planDetails[plan].period.includes('month') ? 'mo' : planDetails[plan].period}` : '-'}
          </span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-purple-600">
              {plan ? `${planDetails[plan].price}/${planDetails[plan].period.includes('month') ? 'mo' : planDetails[plan].period}` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 dark:text-white">Payment Method</h3>
        
        <div className="space-y-1">
          <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Card Number
          </label>
          <div className="relative">
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              placeholder="4242 4242 4242 4242"
              className={`w-full p-2.5 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
                validationErrors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
              }`}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
          {validationErrors.cardNumber && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="cardExpiry" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiration Date
            </label>
            <input
              id="cardExpiry"
              type="text"
              value={cardExpiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength={5}
              className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
                validationErrors.cardExpiry ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
              }`}
            />
            {validationErrors.cardExpiry && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.cardExpiry}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="cardCvc" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              CVC
            </label>
            <div className="relative">
              <input
                id="cardCvc"
                type="text"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/\\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
                  validationErrors.cardCvc ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            {validationErrors.cardCvc && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.cardCvc}</p>
            )}
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="space-y-4 pt-2">
        <h3 className="font-medium text-gray-900 dark:text-white">Billing Information</h3>
        
        <div className="space-y-1">
          <label htmlFor="billingName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Name on Card
          </label>
          <input
            id="billingName"
            type="text"
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
              validationErrors.billingName ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
            }`}
            placeholder="John Smith"
          />
          {validationErrors.billingName && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.billingName}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="billingZip" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Zip/Postal Code
          </label>
          <input
            id="billingZip"
            type="text"
            value={billingZip}
            onChange={(e) => setBillingZip(e.target.value)}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
              validationErrors.billingZip ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
            }`}
            placeholder="12345"
          />
          {validationErrors.billingZip && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.billingZip}</p>
          )}
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="space-y-1">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300"
            />
          </div>
          <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </label>
        </div>
        {validationErrors.agreeToTerms && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.agreeToTerms}</p>
        )}
      </div>
      
      {/* Secure Payment Note */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 flex items-center justify-center">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure payment processing
      </div>
    </div>
  );
}
