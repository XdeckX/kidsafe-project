"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth-context";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import ShareLinkModal from "../../../components/kid/ShareLinkModal";
import { type ChildProfile } from "@repo/lib/src/types";

// Mock data for child profiles in local storage
const STORAGE_KEY = "kidsafe_child_profiles";
const WATCH_HISTORY_KEY = "kidsafe_watch_history";

// Analytics types
type WatchSession = {
  childId: string;
  videoId: string;
  channelId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in seconds
};

type AnalyticsSummary = {
  totalWatchTime: number; // in minutes
  videosWatched: number;
  lastActivity?: string;
};

export default function ParentDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>([]);
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [shareModalData, setShareModalData] = useState<{ childId: string; childName: string } | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileBirthYear, setNewProfileBirthYear] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Record<string, AnalyticsSummary>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'subscription' | 'profiles' | 'analytics'>('overview');

  // Load child profiles from localStorage
  useEffect(() => {
    try {
      const profiles = localStorage.getItem(STORAGE_KEY);
      if (profiles) {
        setChildProfiles(JSON.parse(profiles));
      }
    } catch (error) {
      console.error("Failed to load child profiles", error);
    }
  }, []);
  
  // Load watch history and generate analytics
  useEffect(() => {
    try {
      // Load watch history from localStorage
      const watchHistoryStr = localStorage.getItem(WATCH_HISTORY_KEY);
      
      if (watchHistoryStr && childProfiles.length > 0) {
        const watchHistory: WatchSession[] = JSON.parse(watchHistoryStr);
        const analyticsData: Record<string, AnalyticsSummary> = {};
        
        // Initialize analytics for each child
        childProfiles.forEach(child => {
          analyticsData[child.id] = {
            totalWatchTime: 0,
            videosWatched: 0
          };
        });
        
        // Process watch history to calculate analytics
        watchHistory.forEach(session => {
          const childAnalytics = analyticsData[session.childId];
          if (childAnalytics) {
            // Count video
            childAnalytics.videosWatched++;
            
            // Add watch time if available
            if (session.duration) {
              childAnalytics.totalWatchTime += Math.round(session.duration / 60);
            }
            
            // Update last activity
            const activityTime = session.endTime || session.startTime;
            if (!childAnalytics.lastActivity || 
                new Date(activityTime) > new Date(childAnalytics.lastActivity)) {
              childAnalytics.lastActivity = activityTime;
            }
          }
        });
        
        setAnalytics(analyticsData);
      } else {
        // Create empty analytics for demo purposes
        const demoAnalytics: Record<string, AnalyticsSummary> = {};
        
        childProfiles.forEach(child => {
          // Generate random demo analytics
          demoAnalytics[child.id] = {
            totalWatchTime: Math.floor(Math.random() * 120),
            videosWatched: Math.floor(Math.random() * 15),
            lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          };
        });
        
        setAnalytics(demoAnalytics);
      }
    } catch (error) {
      console.error("Failed to load watch history", error);
    }
  }, [childProfiles]);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (childProfiles.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(childProfiles));
    }
  }, [childProfiles]);

  // Handle adding a new child profile
  const handleAddProfile = () => {
    if (!newProfileName.trim()) {
      setError("Please enter a name for the profile");
      return;
    }

    // Check subscription plan limits
    if (user?.subscription_plan === 'single' && childProfiles.length >= 1) {
      setError("Your single-child plan only allows one profile. Please upgrade to add more children.");
      return;
    }

    // For family plan, limit to 5 profiles
    if (user?.subscription_plan === 'family' && childProfiles.length >= 5) {
      setError("Your family plan allows up to 5 child profiles.");
      return;
    }

    const newProfile: ChildProfile = {
      id: `child_${Date.now()}`,
      parent_id: user?.id || 'unknown',
      name: newProfileName.trim(),
      birth_year: newProfileBirthYear,
      avatar_color: getRandomColor(),
      created_at: new Date().toISOString(),
    };

    setChildProfiles((prev) => [...prev, newProfile]);
    setNewProfileName("");
    setNewProfileBirthYear(undefined);
    setShowAddProfileModal(false);
    setError(null);
  };

  // Generate a random color for the avatar
  const getRandomColor = () => {
    const colors = [
      "#4CAF50", // Green
      "#2196F3", // Blue
      "#F44336", // Red
      "#FF9800", // Orange
      "#9C27B0", // Purple
      "#00BCD4", // Cyan
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle entering kid mode for a specific child
  const enterKidMode = (childId: string) => {
    router.push(`/kid/${childId}`);
  };

  const shareWithKid = (childId: string) => {
    const child = childProfiles.find(profile => profile.id === childId);
    if (!child) return;
    
    setShareModalData({
      childId,
      childName: child.name
    });
  };

  // Check if user is logged in
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access the dashboard</h1>
          <Link href="/login">
            <Button variant="kid">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format relative time (e.g., "2 days ago", "3 hours ago")
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h1>
            {user?.name && (
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg">Welcome back, {user.name}!</p>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={signOut} 
            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Summary Section with Tabs */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name ? `${user.name}'s Dashboard` : 'My Dashboard'}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <nav className="flex space-x-2 overflow-x-auto pb-1" aria-label="Dashboard tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${activeTab === 'overview' 
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-b-2 border-purple-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${activeTab === 'subscription' 
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-b-2 border-purple-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Subscription
              </button>
              <button
                onClick={() => setActiveTab('profiles')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${activeTab === 'profiles' 
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-b-2 border-purple-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Child Profiles
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${activeTab === 'analytics' 
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-b-2 border-purple-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-wrap gap-6">
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setActiveTab('subscription')}>
                    <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">SUBSCRIPTION</p>
                      <p className="text-sm font-bold text-purple-800 dark:text-purple-200">
                        {user?.subscription_plan === 'family' ? 'Family Plan' : 'Single Child Plan'}
                        {user?.subscription_status === 'active' && ' · Active'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setActiveTab('profiles')}>
                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">CHILD PROFILES</p>
                      <p className="text-sm font-bold text-green-800 dark:text-green-200">
                        {childProfiles.length} / {user?.subscription_plan === 'family' ? '5' : '1'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => setActiveTab('analytics')}>
                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">WATCH ACTIVITY</p>
                      <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                        {Object.values(analytics).reduce((sum, item) => sum + item.totalWatchTime, 0)} minutes total
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Subscription</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your plan and billing information</p>
                  </div>
                  <Button 
                    variant="outline"
                    className="text-purple-600 border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                  >
                    Upgrade Plan
                  </Button>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.subscription_plan === 'family' ? 'Family Plan' : 'Single Child Plan'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.subscription_plan === 'family' 
                          ? 'Up to 5 child profiles with advanced features' 
                          : 'One child profile with standard features'}
                      </p>
                    </div>
                    <div className="text-green-600 dark:text-green-400 font-medium">
                      {user?.subscription_status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Price</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {user?.subscription_plan === 'family' ? '$9.99/month' : '$4.99/month'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Renewal Date</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {user?.subscription_period_end 
                          ? new Date(user.subscription_period_end).toLocaleDateString() 
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                      <span className="text-gray-900 dark:text-white font-medium">Visa ending in 4242</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 w-full justify-center"
                  >
                    Update Payment Method
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 w-full justify-center"
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            )}
            
            {/* Child Profiles Tab */}
            {activeTab === 'profiles' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Child Profiles</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.subscription_plan === 'family'
                        ? `You can create up to 5 profiles (${5 - childProfiles.length} remaining)`
                        : `You can create 1 profile (${Math.max(0, 1 - childProfiles.length)} remaining)`}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowAddProfileModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 shadow-md hover:shadow-lg"
                    disabled={
                      (user?.subscription_plan === 'single' && childProfiles.length >= 1) ||
                      (user?.subscription_plan === 'family' && childProfiles.length >= 5)
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Child Profile
                  </Button>
                </div>
                
                {childProfiles.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">You haven't added any child profiles yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {childProfiles.map((child) => (
                      <div 
                        key={child.id} 
                        className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                            style={{ backgroundColor: child.avatar_color || '#6C63FF' }}
                          >
                            {child.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{child.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {child.birth_year ? `Age: ${new Date().getFullYear() - child.birth_year}` : 'Age not specified'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-gray-600">
                            Edit
                          </Button>
                          <Button 
                            onClick={() => enterKidMode(child.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
                            size="sm"
                          >
                            Enter Kid Mode
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Viewing Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your children's watch activity</p>
                </div>
                
                {childProfiles.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Add a child profile to see analytics.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">TOTAL WATCH TIME</p>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                          {Object.values(analytics).reduce((sum, item) => sum + item.totalWatchTime, 0)} min
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <p className="text-sm text-green-600 dark:text-green-300 font-medium">VIDEOS WATCHED</p>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                          {Object.values(analytics).reduce((sum, item) => sum + item.videosWatched, 0)}
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">AVERAGE SESSION</p>
                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                          {Math.round(Object.values(analytics).reduce((sum, item) => sum + item.totalWatchTime, 0) / 
                            Math.max(1, Object.values(analytics).reduce((sum, item) => sum + item.videosWatched, 0)))} min
                        </p>
                      </div>
                    </div>
                    
                    {/* Per-child analytics */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Activity by Child</h4>
                      <div className="space-y-4">
                        {childProfiles.map((child) => {
                          const childAnalytics = analytics[child.id] || {
                            totalWatchTime: 0,
                            videosWatched: 0,
                            lastActivity: undefined
                          };
                          
                          return (
                            <div key={child.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    style={{ backgroundColor: child.avatar_color || '#6C63FF' }}
                                  >
                                    {child.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-white">{child.name}</span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Last active: {formatRelativeTime(childAnalytics.lastActivity)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">{childAnalytics.totalWatchTime} minutes</span> watched
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">{childAnalytics.videosWatched} videos</span> watched
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Child Profiles Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Child Profiles</h3>
            <Button 
              onClick={() => setShowAddProfileModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 shadow-md hover:shadow-lg"
              disabled={
                (user?.subscription_plan === 'single' && childProfiles.length >= 1) ||
                (user?.subscription_plan === 'family' && childProfiles.length >= 5)
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Child Profile
            </Button>
          </div>

          {childProfiles.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center transition-all duration-300 hover:shadow-lg">
              <div className="mb-6">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">You haven't added any child profiles yet</p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first child profile to get started with KidSafe YouTube</p>
              </div>
              <Button 
                onClick={() => setShowAddProfileModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 shadow-md hover:shadow-lg pulse-animation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Child
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {childProfiles.map((child) => {
                const childAnalytics = analytics[child.id] || {
                  totalWatchTime: 0,
                  videosWatched: 0,
                  lastActivity: undefined
                };
                
                return (
                  <Card 
                    key={child.id} 
                    className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner transition-transform duration-300 hover:scale-105"
                          style={{ backgroundColor: child.avatar_color || '#6C63FF' }}
                        >
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900 dark:text-white">{child.name}</CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {child.birth_year ? `Age: ${new Date().getFullYear() - child.birth_year}` : 'Age not specified'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">WATCH TIME</p>
                          <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                            {childAnalytics.totalWatchTime} min
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                          <p className="text-xs text-green-700 dark:text-green-300 font-medium">VIDEOS WATCHED</p>
                          <p className="text-sm font-bold text-green-800 dark:text-green-200">
                            {childAnalytics.videosWatched}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Last activity: {formatRelativeTime(childAnalytics.lastActivity)}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col pt-2 gap-2">
                      <div className="flex justify-between gap-2">
                        <Link href={`/parent/child/${child.id}/channels`} className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => enterKidMode(child.id)} 
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Kid Mode
                        </Button>
                      </div>
                      <Button 
                        onClick={() => shareWithKid(child.id)}
                        variant="outline"
                        className="w-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share with Kid
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Share Link Modal */}
      {shareModalData && (
        <ShareLinkModal
          childId={shareModalData.childId}
          childName={shareModalData.childName}
          onClose={() => setShareModalData(null)}
        />
      )}

      {/* Add Profile Modal */}
      {showAddProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add Child Profile</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="childName" className="block text-sm font-medium mb-1">
                  Child's Name
                </label>
                <input
                  id="childName"
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label htmlFor="birthYear" className="block text-sm font-medium mb-1">
                  Birth Year (optional)
                </label>
                <input
                  id="birthYear"
                  type="number"
                  min={new Date().getFullYear() - 12}
                  max={new Date().getFullYear() - 1}
                  value={newProfileBirthYear || ''}
                  onChange={(e) => setNewProfileBirthYear(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. 2018"
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddProfileModal(false);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="kid" onClick={handleAddProfile}>
                  Add Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
