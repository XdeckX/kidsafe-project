"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Types
type KidProfile = {
  id: string;
  name: string;
  avatar_color: string;
  pin?: string;
  age?: number;
};

export default function KidLoginPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<KidProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<KidProfile | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load profiles from localStorage (frontend-first approach)
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem("kidsafe_child_profiles");
      if (storedProfiles) {
        setProfiles(JSON.parse(storedProfiles));
      }
    } catch (error) {
      console.error("Failed to load profiles:", error);
    }
  }, []);

  // Handle PIN submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfile) return;
    
    setLoading(true);

    // For frontend-first approach, we'll use simple validation
    // In production, this would validate against a backend API
    setTimeout(() => {
      // If PIN is not set or matches (for demo purposes)
      if (!selectedProfile.pin || selectedProfile.pin === pin) {
        // Store the active kid profile in localStorage
        localStorage.setItem("kidsafe_active_kid", JSON.stringify(selectedProfile));
        
        // Redirect to kid dashboard
        router.push("/kid/dashboard");
      } else {
        setError("Incorrect PIN. Please try again.");
      }
      setLoading(false);
    }, 500);
  };

  // Clear PIN when changing profiles
  useEffect(() => {
    setPin("");
    setError("");
  }, [selectedProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-6 text-purple-600 hover:text-purple-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">
            KidSafe YouTube
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Who's watching?
          </p>
        </div>
        
        {selectedProfile ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn">
            <div className="flex flex-col items-center mb-6">
              <button 
                onClick={() => setSelectedProfile(null)} 
                className="self-start text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 mt-2"
                style={{ backgroundColor: selectedProfile.avatar_color }}
              >
                {selectedProfile.name.charAt(0).toUpperCase()}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Hi, {selectedProfile.name}!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Enter your PIN to start watching
              </p>
            </div>
            
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="flex justify-center">
                <div className="pin-input flex gap-2 mb-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div 
                      key={i} 
                      className="w-12 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-xl font-bold bg-gray-50 dark:bg-gray-700"
                    >
                      {pin.length > i ? '•' : ''}
                    </div>
                  ))}
                </div>
              </div>
              
              <input 
                type="password" 
                className="sr-only"
                value={pin}
                onChange={(e) => {
                  const newPin = e.target.value.replace(/[^0-9]/g, '');
                  if (newPin.length <= 4) {
                    setPin(newPin);
                  }
                }}
                maxLength={4}
                autoFocus
              />
              
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((num, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-14 rounded-lg font-bold text-xl ${
                      num === 'del' 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : num === null
                        ? 'invisible'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    } hover:opacity-80 transition-opacity`}
                    onClick={() => {
                      if (num === 'del') {
                        setPin(prev => prev.slice(0, -1));
                      } else if (num !== null && pin.length < 4) {
                        setPin(prev => prev + num);
                      }
                    }}
                  >
                    {num === 'del' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : num}
                  </button>
                ))}
              </div>
              
              {error && (
                <p className="text-red-600 dark:text-red-400 text-center mt-4">
                  {error}
                </p>
              )}
              
              <button
                type="submit"
                disabled={pin.length < 4 || loading}
                className={`w-full py-3 rounded-lg text-white font-bold mt-4 ${
                  pin.length < 4 || loading
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                } transition-colors`}
              >
                {loading ? 'Checking...' : 'Start Watching'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Choose your profile
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2"
                    style={{ backgroundColor: profile.avatar_color }}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-lg font-medium text-gray-800 dark:text-white">
                    {profile.name}
                  </span>
                </button>
              ))}
            </div>
            
            {profiles.length === 0 && (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  No profiles available
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Ask a parent to create a profile for you
                </p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Link 
                href="/login" 
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm"
              >
                Parent Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
