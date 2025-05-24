"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<'free-trial' | 'single' | 'family' | null>(null);
  
  const handleSelectPlan = (plan: 'free-trial' | 'single' | 'family') => {
    setSelectedPlan(plan);
    // In a production app, we would store this selection in localStorage
    // or in a global state management system to pass to the registration page
    // For now, we'll use URL parameters
    window.location.href = `/login?signup=true&plan=${plan}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-6xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            KidSafe YouTube
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            A safe, parent-controlled YouTube experience for your children
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/login" 
              className="bg-purple-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md"
            >
              Sign In
            </Link>
            <Link 
              href="/login?signup=true" 
              className="bg-white text-purple-600 border border-purple-600 py-3 px-8 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Pricing</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-10">Choose the plan that's right for your family</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Trial Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <h3 className="text-xl font-semibold mb-1">Free Trial</h3>
                <p className="text-sm opacity-90">Try before you subscribe</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                  <span className="text-gray-600 dark:text-gray-400"> / 7 days</span>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">After trial, automatically converts to Single Child Plan</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    1 child profile
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Full content filtering
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Basic screen time controls
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No credit card required
                  </li>
                </ul>
                <button 
                  onClick={() => handleSelectPlan('free-trial')}
                  className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-all shadow-md"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
            
            {/* Single Child Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                <h3 className="text-xl font-semibold mb-1">Single Child</h3>
                <p className="text-sm opacity-90">Perfect for one child</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$2.99</span>
                  <span className="text-gray-600 dark:text-gray-400"> / month</span>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Billed monthly, cancel anytime</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    1 child profile
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced content filtering
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Full screen time management
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Email support
                  </li>
                </ul>
                <button 
                  onClick={() => handleSelectPlan('single')}
                  className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition-all shadow-md"
                >
                  Select Plan
                </button>
              </div>
            </div>
            
            {/* Family Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-purple-500">
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h3 className="text-xl font-semibold mb-1">Family Plan</h3>
                <p className="text-sm opacity-90">Best value for families</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$9.99</span>
                  <span className="text-gray-600 dark:text-gray-400"> / month</span>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Billed monthly, cancel anytime</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Up to 5 child profiles
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Premium content filtering
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced screen time controls
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Custom content categories
                  </li>
                </ul>
                <button 
                  onClick={() => handleSelectPlan('family')}
                  className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 transition-all shadow-md"
                >
                  Select Plan
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Parent Controls</h3>
            <p className="text-gray-600 dark:text-gray-400">Whitelist channels and set viewing limits to ensure your children only watch appropriate content.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Filtering</h3>
            <p className="text-gray-600 dark:text-gray-400">Advanced AI technology automatically filters out inappropriate content that may slip through platform moderation.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Screen Time Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Set daily limits and schedules to help manage your child watching habits and encourage healthy screen time.</p>
          </div>
        </div>
      </main>
      
      <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} KidSafe YouTube. All rights reserved.</p>
        <p className="mt-2">Built with safety and families in mind.</p>
      </footer>
    </div>
  );
}
