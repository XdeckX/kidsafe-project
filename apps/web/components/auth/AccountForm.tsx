"use client";

import { useState } from "react";

interface AccountFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  name: string;
  setName: (name: string) => void;
  validationErrors: Record<string, string>;
  isSignUp: boolean;
}

export function AccountForm({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  validationErrors,
  isSignUp
}: AccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      {isSignUp && (
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
              validationErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
            }`}
            placeholder="John Smith"
          />
          {validationErrors.name && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
          )}
        </div>
      )}
      
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
            validationErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
          }`}
          placeholder="you@example.com"
        />
        {validationErrors.email && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
              validationErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
            }`}
            placeholder="••••••••"
          />
          <button 
            type="button" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {validationErrors.password && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.password}</p>
        )}
      </div>
      
      {isSignUp && (
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors ${
                validationErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800'
              }`}
              placeholder="••••••••"
            />
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.confirmPassword}</p>
          )}
        </div>
      )}
    </div>
  );
}
