"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Parent } from '@repo/lib/src/types';

type RegistrationData = {
  name: string;
  password: string;
};

type AuthContextType = {
  user: Parent | null;
  loading: boolean;
  signIn: (email: string, registrationData?: RegistrationData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  refreshUser: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signOut: () => {},
  refreshUser: () => {},
});

// Custom hook for using auth
export const useAuth = () => useContext(AuthContext);

// Simple hash function for development (not for production use)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial load of user from localStorage
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('kidsafe_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from localStorage', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Check if user exists in localStorage
  const checkUserExists = (email: string): boolean => {
    try {
      const usersMap = localStorage.getItem('kidsafe_users_map');
      if (usersMap) {
        const users = JSON.parse(usersMap);
        return !!users[email];
      }
      return false;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  // For development, we'll use localStorage to mock auth
  // Later, this will be replaced with Supabase auth
  const signIn = async (email: string, registrationData?: RegistrationData) => {
    try {
      // Get users map from localStorage
      let usersMap: Record<string, { id: string; passwordHash: string; name?: string }> = {};
      const storedUsersMap = localStorage.getItem('kidsafe_users_map');
      
      if (storedUsersMap) {
        usersMap = JSON.parse(storedUsersMap);
      }

      // Handle registration
      if (registrationData) {
        if (usersMap[email]) {
          return {
            success: false,
            error: 'An account with this email already exists'
          };
        }

        // Create new user
        const userId = 'user_' + Math.random().toString(36).substring(2, 15);
        const passwordHash = simpleHash(registrationData.password);
        
        // Save to users map
        usersMap[email] = {
          id: userId,
          passwordHash,
          name: registrationData.name
        };
        
        localStorage.setItem('kidsafe_users_map', JSON.stringify(usersMap));

        // Create mock user
        const mockUser: Parent = {
          id: userId,
          email,
          name: registrationData.name,
          created_at: new Date().toISOString(),
          subscription_plan: 'single',
          subscription_status: 'active',
          subscription_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        // Store in localStorage
        localStorage.setItem('kidsafe_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { success: true };
      }
      // Handle login
      else {
        const userRecord = usersMap[email];
        
        if (!userRecord) {
          // For development purposes, create a new account if it doesn't exist
          const userId = 'user_' + Math.random().toString(36).substring(2, 15);
          
          // For simplicity during development, we'll auto-create an account
          const mockUser: Parent = {
            id: userId,
            email,
            created_at: new Date().toISOString(),
            subscription_plan: 'single',
            subscription_status: 'active',
            subscription_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          };

          // Store in localStorage
          localStorage.setItem('kidsafe_user', JSON.stringify(mockUser));
          setUser(mockUser);
          
          return { success: true };
        }

        // Get user from the record
        const mockUser: Parent = {
          id: userRecord.id,
          email,
          name: userRecord.name,
          created_at: new Date().toISOString(), // Mock creation date
          subscription_plan: 'single',
          subscription_status: 'active',
          subscription_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        // Store in localStorage
        localStorage.setItem('kidsafe_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: 'Failed to sign in. Please try again.' 
      };
    }
  };

  const signOut = () => {
    localStorage.removeItem('kidsafe_user');
    setUser(null);
  };

  const refreshUser = () => {
    try {
      const storedUser = localStorage.getItem('kidsafe_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user from localStorage', error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
